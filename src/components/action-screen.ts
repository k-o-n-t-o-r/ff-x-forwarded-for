import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import "./button";

@customElement('ext-action-screen')
export class ActionScreenElement extends LitElement {
    static override styles = css`
        * {
            box-sizing: border-box;
        }
        h1 {
            margin: 0 0 0.5rem 0;
            text-align: center;
        }
        h2 {
            margin: 0.75rem 0 0.5rem 0;
            font-size: 0.9rem;
            font-weight: 500;
            text-align: left;
        }
        h3 {
            margin: 0.5rem 0 1rem 0;
            text-align: center;
        }
        p {
            text-align: center;
        }
        p.disabled {
            color: var(--color-error);
            font-size: 0.85rem;
            font-weight: bold;
            margin-bottom: 0;
        }
        ext-button {
            display: block;
            margin: 0.5rem 0;
        }
        ext-button:last-of-type {
            margin-bottom: 0;
        }
        .profile-list {
            margin: 0.5rem 0;
            padding: 0;
        }
        .profile-item {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            margin: 0.25rem 0;
            background: var(--color-surface-mixed-300);
            border-radius: 0.5rem;
            font-size: 0.85rem;
        }
        .profile-item label {
            display: flex;
            align-items: center;
            flex: 1;
            cursor: pointer;
            text-align: left;
        }
        .profile-item input[type="checkbox"] {
            margin-right: 0.5rem;
        }
        .profile-name {
            flex: 1;
            font-weight: 500;
        }
        .profile-status {
            font-size: 0.75rem;
            color: var(--color-primary-text-muted);
        }
    `;

    override connectedCallback() {
        super.connectedCallback();

        chrome.storage.sync.get(["enabled", "profiles"], ((settings) => {
            if (settings) {
                this._enabled = settings.enabled || false;
                this._profiles = settings.profiles || [];
            } else {
                this._enabled = false;
                this._profiles = [];
            }
        }));
    }

    @state()
    private _enabled: boolean = false;

    @state()
    private _profiles: Profile[] = [];

    // Render the UI as a function of component state
    override render() {
        return html`
            <h1>${chrome.i18n.getMessage("ext_name")}</h1>
            <p>
                ${chrome.i18n.getMessage("action_profiles_enabled_count", [
                    String(this._enabled ? this._profiles.filter((profile) => profile.enabled).length : 0),
                    String(this._profiles.length)
                ])}
            </p>

            ${this._profiles.length > 0 ? html`
                <h2>Quick Toggle</h2>
                <div class="profile-list">
                    ${this._profiles.map((profile) => html`
                        <div class="profile-item">
                            <label>
                                <input
                                    type="checkbox"
                                    .checked=${profile.enabled}
                                    @change=${() => this._toggleProfile(profile.id)}
                                    ?disabled=${!this._enabled}
                                >
                                <span class="profile-name">${profile.name}</span>
                            </label>
                            ${profile.randomizeIp ? html`<span class="profile-status">🔄</span>` : ''}
                        </div>
                    `)}
                </div>
            ` : ''}

            <ext-button @click=${this._openProfilePage} class="btn-outline">${chrome.i18n.getMessage("btn_edit_profiles")}</ext-button>
            ${this._enabled ? html`
                <ext-button @click=${this._testHeaders} class="btn-outline">Test Headers</ext-button>
            ` : ''}
            ${this._enabled ?
                html`
                    <ext-button @click=${this._toggleEnabled} class="btn-outline btn-danger">
                        ${chrome.i18n.getMessage(`btn_disable_extension`)}
                    </ext-button>` :
                html`
                    <ext-button @click=${this._toggleEnabled} class="btn-outline btn-success">
                        ${chrome.i18n.getMessage(`btn_enable_extension`)}
                    </ext-button>
                    <p class="disabled">
                        ${chrome.i18n.getMessage("action_profiles_extension_disabled")}
                    </p>`
                }
        `
    }

    protected _toggleProfile(profileId: number) {
        const updatedProfiles = this._profiles.map(profile => {
            if (profile.id === profileId) {
                return { ...profile, enabled: !profile.enabled };
            }
            return profile;
        });

        this._profiles = updatedProfiles;
        chrome.storage.sync.set({ profiles: updatedProfiles });
    }

    protected _toggleEnabled() {
        this._enabled = !this._enabled;
        chrome.storage.sync.set({
            enabled: this._enabled
        }).then(() => {
            // @TODO: Show success message
        }).catch(() => {
            // @TODO: Show error message
        })
    }
    protected async _openProfilePage() {
        const url = chrome.runtime.getURL("profiles.html");
        // @TODO: Check if profile page is already open?
        await chrome.tabs.create({url:url, active:true});
    }

    protected async _testHeaders() {
        // Open httpbin.org to test headers
        await chrome.tabs.create({url: "https://httpbin.org/headers", active: true});
    }

}
