const generateRandomIPv4 = (): string => {
    // Generate a random IP address (avoiding reserved ranges)
    // Using public IP ranges for more realistic spoofing
    const octet1 = Math.floor(Math.random() * 223) + 1; // 1-223 (avoiding 224-255 multicast/reserved)
    const octet2 = Math.floor(Math.random() * 256);
    const octet3 = Math.floor(Math.random() * 256);
    const octet4 = Math.floor(Math.random() * 254) + 1; // 1-254 (avoiding 0 and 255)

    // Avoid some reserved ranges
    if (octet1 === 10 || // 10.0.0.0/8
        (octet1 === 172 && octet2 >= 16 && octet2 <= 31) || // 172.16.0.0/12
        (octet1 === 192 && octet2 === 168) || // 192.168.0.0/16
        octet1 === 127) { // 127.0.0.0/8 (loopback)
        // Recursively generate a new IP if we hit a private range
        return generateRandomIPv4();
    }

    return `${octet1}.${octet2}.${octet3}.${octet4}`;
};

const generateRandomIPv6 = (): string => {
    // Generate a random IPv6 address (using public unicast range 2000::/3)
    const hexChars = '0123456789abcdef';
    const segments: string[] = [];

    // First segment should start with 2 or 3 for global unicast (2000::/3)
    const firstSegment = (Math.random() < 0.5 ? '2' : '3') +
        Array.from({length: 3}, () => hexChars[Math.floor(Math.random() * 16)]).join('');
    segments.push(firstSegment);

    // Generate remaining 7 segments
    for (let i = 0; i < 7; i++) {
        const segment = Array.from({length: 4}, () =>
            hexChars[Math.floor(Math.random() * 16)]
        ).join('');
        segments.push(segment);
    }

    return segments.join(':');
};

const generateRandomIp = (useIPv6: boolean = false): string => {
    return useIPv6 ? generateRandomIPv6() : generateRandomIPv4();
};

interface Profile {
    id: number;
    name: string;
    headers: string[];
    value: string;
    domains: string[];
    includeDomains: boolean;
    enabled: boolean;
    randomizeIp?: boolean;
    randomizeInterval?: number; // in seconds
    useIPv6?: boolean;
    randomizeHeaders?: boolean;
    randomHeaderCount?: number; // How many headers to send when randomizing
    _activeHeaders?: string[]; // Internal: currently active subset of headers
}

interface LegacyV0Settings {
    spoofIp: string,
    previous: string[],
    headers: string[],
}

const getRandomSubset = <T,>(array: T[], count?: number): T[] => {
    if (array.length === 0) return [];

    let actualCount: number;

    if (count !== undefined && count > 0) {
        // Use specified count, but don't exceed array length
        actualCount = Math.min(count, array.length);
    } else {
        // Random count between 1 and array length
        actualCount = Math.floor(Math.random() * array.length) + 1;
    }

    // Shuffle and take the first 'actualCount' items
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, actualCount);
};

const convertProfileToRule = (profile: Profile): chrome.declarativeNetRequest.Rule => {
    // Use active headers if header randomization is enabled, otherwise use all headers
    const headersToUse = profile._activeHeaders || profile.headers;

    const rule: chrome.declarativeNetRequest.Rule = {
        id: profile.id,
        priority: profile.id,
        action: {
            type: "modifyHeaders" as chrome.declarativeNetRequest.RuleActionType,
            requestHeaders: headersToUse.map((header) => {
                return {
                    header: header.toLowerCase(),
                    operation: "set" as chrome.declarativeNetRequest.HeaderOperation,
                    value: profile.value,
                }
            }),
        },
        condition: {
            resourceTypes: [
                "main_frame",
                "sub_frame",
                "stylesheet",
                "script",
                "image",
                "font",
                "object",
                "xmlhttprequest",
                "ping",
                "csp_report",
                "media",
                "websocket",
                "other"
            ] as chrome.declarativeNetRequest.ResourceType[],
        },
    };

    if (profile.domains.length) {
        if (profile.includeDomains) {
            rule.condition.requestDomains = profile.domains;
        } else {
            rule.condition.excludedRequestDomains = profile.domains;
        }
    }
    return rule;
}

const updateDeclarativeRules = ({ addRules = [], removeRules = [] }: { addRules?: chrome.declarativeNetRequest.Rule[], removeRules?: chrome.declarativeNetRequest.Rule[] }) => {
    const removeRuleIds = removeRules.map(rule => rule.id);
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds,
        addRules,
    }).then(() => {
        console.log("updateDynamicRules successful", {
            removeRuleIds,
            addRules,
        });
    }).catch((e) => {
        console.error("updateDynamicRules failed", e);
    });
}

const updateFromSettings = async () => {
    const storedSettings = await chrome.storage.sync.get(["enabled", "profiles"]) as { enabled?: boolean, profiles?: Profile[] };
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    let enabled: boolean;

    if(!storedSettings || !storedSettings.enabled || !storedSettings.profiles) {
        if(oldRules.length) {
            updateDeclarativeRules({ removeRules: oldRules });
        }
        enabled = false;
    } else {
        // Initialize random IPs for profiles that need them
        let profilesUpdated = false;
        const updatedProfiles = storedSettings.profiles.map(profile => {
            if (profile.randomizeIp && (profile.value === "auto" || !profile.value)) {
                profilesUpdated = true;
                return { ...profile, value: generateRandomIp(profile.useIPv6 || false) };
            }
            return profile;
        });

        // Save updated profiles if any were initialized (but prevent recursive updates)
        if (profilesUpdated) {
            // Use a flag to prevent recursive updates
            await chrome.storage.sync.set({ profiles: updatedProfiles, _updating: true });
            storedSettings.profiles = updatedProfiles;
        }

        // Rebuild the dynamic rule set
        const rules: chrome.declarativeNetRequest.Rule[] = storedSettings.profiles
            .filter((profile) => profile.enabled)
            .map(convertProfileToRule);

        updateDeclarativeRules({addRules: rules, removeRules: oldRules});
        enabled = true;
    }
    await updateIcon(enabled);
};

const updateRandomizedProfiles = async () => {
    const storedSettings = await chrome.storage.sync.get(["profiles", "lastRandomizeTime"]) as {
        profiles?: Profile[],
        lastRandomizeTime?: { [key: number]: number }
    };

    if (!storedSettings?.profiles) {
        return;
    }

    const currentTime = Date.now() / 1000; // Convert to seconds
    const lastRandomizeTime = storedSettings.lastRandomizeTime || {};
    let profilesUpdated = false;
    let timeUpdated = false;

    // Generate new random IPs/headers for profiles whose interval has elapsed
    const updatedProfiles = storedSettings.profiles.map(profile => {
        const shouldRandomize = (profile.randomizeIp || profile.randomizeHeaders) && profile.enabled;

        if (shouldRandomize) {
            const interval = profile.randomizeInterval || 5;
            const lastUpdate = lastRandomizeTime[profile.id] || 0;

            // Check if enough time has passed
            if (currentTime - lastUpdate >= interval) {
                profilesUpdated = true;
                timeUpdated = true;
                lastRandomizeTime[profile.id] = currentTime;

                const updates: Partial<Profile> = {};

                // Randomize IP if enabled
                if (profile.randomizeIp) {
                    updates.value = generateRandomIp(profile.useIPv6 || false);
                }

                // Randomize headers if enabled
                if (profile.randomizeHeaders && profile.headers.length > 0) {
                    updates._activeHeaders = getRandomSubset(profile.headers, profile.randomHeaderCount);
                }

                return { ...profile, ...updates };
            }
        }
        return profile;
    });

    // Save updated profiles and timestamps
    if (profilesUpdated) {
        await chrome.storage.sync.set({ profiles: updatedProfiles, _updating: true });
    }
    if (timeUpdated) {
        await chrome.storage.sync.set({ lastRandomizeTime });
    }
};

const updateIcon = async (enabled?: boolean)=>  {
    if(typeof enabled !== "boolean") {
        const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
        enabled = oldRules.length > 0;
    }

    const icon = enabled ? "" : "-bw";
    await chrome.action.setIcon({
        path: {
            16: `assets/logo-16${icon}.png`,
            32: `assets/logo-32${icon}.png`,
            38: `assets/logo-38${icon}.png`,
        }});
}

chrome.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
    if(reason === chrome.runtime.OnInstalledReason.INSTALL) {
        await chrome.storage.sync.set({
            "profiles": [],
            "enabled": true,
        });
    }

    if(reason === chrome.runtime.OnInstalledReason.UPDATE) {
        // Migrate from < v1 (manifest v2 -> v3)
        if(previousVersion?.startsWith("0.")) {
            const previousSettings = await chrome.storage.sync.get() as LegacyV0Settings;
            const newProfiles: Profile[] = [];

            if(previousSettings.spoofIp) {
                newProfiles.push({
                    id: 1,
                    name: "Default (Migrated)",
                    headers: previousSettings.headers,
                    value: previousSettings.spoofIp,
                    domains: [],
                    includeDomains: true,
                    enabled: true,
                });
            }

            if(Array.isArray(previousSettings.previous)) {
                previousSettings.previous.forEach((previousIp, index) => {
                    newProfiles.push({
                        id: index+2,
                        name: `${previousIp} (Migrated)`,
                        headers: previousSettings.headers,
                        value: previousIp,
                        domains: [],
                        includeDomains: true,
                        enabled: false,
                    });
                });
            }

            await chrome.storage.sync.set({
                "profiles": newProfiles,
                "enabled": true,
            });
            await chrome.storage.sync.remove(["spoofIp", "previous", "headers"]);
        }
    }

    await updateFromSettings();
});

// Update the icon status based on what DNR rules are enabled on browser startup
chrome.runtime.onStartup.addListener(updateIcon);

// Update the icon & DNR rules when storage has changed
chrome.storage.sync.onChanged.addListener((changes) => {
    // Prevent recursive updates when we're just updating the profiles
    if (changes._updating) {
        // Clean up the flag
        chrome.storage.sync.remove('_updating');
        return;
    }
    updateFromSettings();
});

// Set up alarm for randomized IP updates (every 1 second to support "per request" mode)
const RANDOMIZE_ALARM = "randomize-ip";
chrome.alarms.create(RANDOMIZE_ALARM, { periodInMinutes: 1/60 }); // 1 second

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === RANDOMIZE_ALARM) {
        updateRandomizedProfiles();
    }
});
