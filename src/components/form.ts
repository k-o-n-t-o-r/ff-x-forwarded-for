import { LitElement, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { safeHeaders, advancedHeaders } from "../headers";

const validateIPv4 = (ip: string): boolean => {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipv4Regex.test(ip);
};

const validateIPv6 = (ip: string): boolean => {
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv6Regex.test(ip);
};

const validateIP = (ip: string): boolean => {
    return validateIPv4(ip) || validateIPv6(ip);
};

@customElement('profile-form')
export class ProfileFormElement extends LitElement {
    static override styles = css`
        :host {
            position: fixed;
            z-index: 999;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            box-sizing: border-box;
            
            background: rgba(0, 0, 0, 0.75);
            
            display: flex;
            padding: 1rem;
            justify-content: center;
            align-items: center;
        }
        section {
            width: 100%;
            max-width: calc(1000px - 4rem);
            margin: 0 auto;
            background: var(--color-surface-mixed-200);
            padding: 1rem;
            border-radius: 1rem;
            color: var(--color-primary-text);
        }
        label {
            font-size: 1rem;
        }
        input, select {
            border: 1px solid #ddd;
            background: var(--color-surface-mixed-300);
            border-radius: 4px;
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
            color: var(--color-primary-text);
            margin-bottom: 0.25rem;
        }
        .headers-container {
            border: 1px solid #ddd;
            background: var(--color-surface-mixed-300);
            border-radius: 4px;
            padding: 0.75rem;
            max-height: 400px;
            overflow-y: auto;
        }
        .headers-section {
            margin-bottom: 1rem;
        }
        .headers-section:last-child {
            margin-bottom: 0;
        }
        .headers-section-title {
            font-weight: bold;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid var(--color-surface-mixed-400);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .headers-section-actions {
            font-size: 0.75rem;
            font-weight: normal;
        }
        .headers-section-actions button {
            background: none;
            border: none;
            color: var(--color-primary-100);
            cursor: pointer;
            text-decoration: underline;
            padding: 0;
            margin-left: 0.5rem;
        }
        .headers-section-actions button:hover {
            color: var(--color-primary-200);
        }
        .headers-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .header-checkbox {
            display: flex;
            align-items: center;
            font-size: 0.85rem;
        }
        .header-checkbox input {
            margin-right: 0.5rem;
            margin-bottom: 0;
        }
        .header-checkbox label {
            cursor: pointer;
            user-select: none;
            font-size: 0.85rem;
        }
        input + select,
        select + input,
        select + select,
        input + input {
            margin-top: 0.5rem;
        }
        ::placeholder {
            color: var(--color-primary-text-muted);
        }
        .form-row {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem;            
        }
        .help-text,
        .error-text {
            color: var(--color-primary-text-muted);
            font-size: 0.8rem;
        }
        input.form-error,
        select.form-error {
            border: 1px solid var(--color-error-dark);
        }
        .error-text {
            color: var(--color-error);
        }
        footer {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
        }
    `;

    @property()
    profileId: null|number = null;

    @property()
    name: string = "";

    @property()
    value: string = "";

    @property()
    randomizeIp: boolean = false;

    @property()
    randomizeInterval: number = 5; // in seconds

    @property()
    useIPv6: boolean = false;

    protected _headers: string[] = [];
    @property()
    set headers(headers: string|string[]) {
        if(!Array.isArray(headers)) {
            headers = headers.split(/[\s,]+/)
        }
        this._headers = headers;
    }
    get headers(): string[] {
        return this._headers;
    }

    @property()
    includeDomains: boolean = true;

    protected _domains: string[] = [];
    @property()
    set domains(domains: string|string[]) {
        if(!Array.isArray(domains)) {
            domains = domains.split(/[\s,]+/)
        }
        this._domains = domains;
        if(this._domains.length && this.allDomains) {
            this.allDomains = false;
        }
    }
    get domains(): string[] {
        return this._domains;
    }

    protected _allDomains: boolean = true;

    @state()
    set allDomains(config: boolean) {
        this._allDomains = config;
        if(config) { this._domains = []; }
    }
    get allDomains(): boolean {
        return this._allDomains;
    }

    @state()
    protected _errors: { [key: string]: string } = {};

    // Render the UI as a function of component state
    override render() {
        return html`
            <section>
                <main>
                    <div class="form-row">
                        <label for="name">${chrome.i18n.getMessage("form_name_label")}</label>
                        <input .value="${this.name}" @change=${this._handleInput} id="name" placeholder="${chrome.i18n.getMessage("form_name_placeholder")}" type="text" class="${this._errors.name ? "form-error" : ""}" required>
                        ${this._errors.name ? html`<span class="error-text">${this._errors.name}</span>` : nothing }
                        <span class="help-text">${chrome.i18n.getMessage("form_help_value")}</span>
                    </div>
                    <div class="form-row ${this._errors.value ? "form-error" : ""}">
                        <label for="value">${chrome.i18n.getMessage("form_value_label")}</label>
                        <input .value="${this.value}" @change=${this._handleInput} id="value" placeholder="127.0.0.1" type="text" class="${this._errors.value ? "form-error" : ""}" ?required=${!this.randomizeIp} ?disabled=${this.randomizeIp}>
                        ${this._errors.value ? html`<span class="error-text">${this._errors.value}</span>` : nothing }
                        <span class="help-text">${chrome.i18n.getMessage("form_value_help")}</span>
                    </div>
                    <div class="form-row">
                        <label>
                            <input type="checkbox" .checked="${this.randomizeIp}" @change=${this._handleCheckbox} id="randomizeIp">
                            Randomize IP automatically
                        </label>
                        <span class="help-text">When enabled, the IP value above will be ignored and a random public IP address will be generated automatically.</span>
                    </div>
                    ${this.randomizeIp ? html`
                        <div class="form-row">
                            <label for="randomizeInterval">Randomization Interval</label>
                            <select .value="${this.randomizeInterval}" @change=${this._handleInput} id="randomizeInterval">
                                <option value="1">Every request (~1 second)</option>
                                <option value="5">Every 5 seconds</option>
                                <option value="30">Every 30 seconds</option>
                                <option value="60">Every 1 minute</option>
                                <option value="300">Every 5 minutes</option>
                                <option value="600">Every 10 minutes</option>
                            </select>
                            <span class="help-text">How often to generate a new random IP address. "Every request" changes IP approximately once per second.</span>
                        </div>
                        <div class="form-row">
                            <label>
                                <input type="checkbox" .checked="${this.useIPv6}" @change=${this._handleCheckbox} id="useIPv6">
                                Use IPv6 instead of IPv4
                            </label>
                            <span class="help-text">Generate random IPv6 addresses instead of IPv4.</span>
                        </div>
                    ` : nothing}
                    <div class="form-row ${this._errors.headers ? "form-error" : ""}">
                        <label>${chrome.i18n.getMessage("form_headers_label")}</label>
                        <div class="headers-container">
                            <div class="headers-section">
                                <div class="headers-section-title">
                                    <span>Safe Headers (Recommended)</span>
                                    <div class="headers-section-actions">
                                        <button type="button" @click=${() => this._selectAllHeaders('safe', true)}>Select All</button>
                                        <button type="button" @click=${() => this._selectAllHeaders('safe', false)}>Deselect All</button>
                                    </div>
                                </div>
                                <div class="headers-grid">
                                    ${safeHeaders.map((header) => html`
                                        <div class="header-checkbox">
                                            <input
                                                type="checkbox"
                                                id="header-${header}"
                                                .checked=${this.headers.includes(header)}
                                                @change=${(e: Event) => this._handleHeaderCheckbox(header, (e.target as HTMLInputElement).checked)}
                                            >
                                            <label for="header-${header}">${header}</label>
                                        </div>
                                    `)}
                                </div>
                            </div>
                            <div class="headers-section">
                                <div class="headers-section-title">
                                    <span>Advanced Headers (May break sites)</span>
                                    <div class="headers-section-actions">
                                        <button type="button" @click=${() => this._selectAllHeaders('advanced', true)}>Select All</button>
                                        <button type="button" @click=${() => this._selectAllHeaders('advanced', false)}>Deselect All</button>
                                    </div>
                                </div>
                                <div class="headers-grid">
                                    ${advancedHeaders.map((header) => html`
                                        <div class="header-checkbox">
                                            <input
                                                type="checkbox"
                                                id="header-${header}"
                                                .checked=${this.headers.includes(header)}
                                                @change=${(e: Event) => this._handleHeaderCheckbox(header, (e.target as HTMLInputElement).checked)}
                                            >
                                            <label for="header-${header}">${header}</label>
                                        </div>
                                    `)}
                                </div>
                            </div>
                        </div>
                        ${this._errors.headers ? html`<span class="error-text">${this._errors.headers}</span>` : nothing }
                        <span class="help-text">${chrome.i18n.getMessage("form_headers_help")}</span>
                    </div>
                    <div class="form-row">
                        <label for="allDomains">${chrome.i18n.getMessage("form_domains_label")}</label>
                        <select .value="${this.allDomains}" @change=${this._handleInput} id="allDomains">
                            <option value="true">${chrome.i18n.getMessage("form_domains_value_all")}</option>
                            <option value="false">${chrome.i18n.getMessage("form_domains_value_some")}</option>
                        </select>
                        ${!this.allDomains ? html`
                            <select .value="${this.includeDomains}" @change=${this._handleInput} id="includeDomains">
                                <option value="true">${chrome.i18n.getMessage("form_domains_value_include")}</option>
                                <option value="false">${chrome.i18n.getMessage("form_domains_value_exclude")}</option>
                            </select>
                            <input .value="${this.domains}" @change=${this._handleInput} id="domains" placeholder="github.com" type="text" class="${this._errors.domains ? "form-error" : ""}" required>
                            ${this._errors.domains ? html`<span class="error-text">${this._errors.domains}</span>` : nothing }
                            <span class="help-text">${chrome.i18n.getMessage("form_domains_help")}</span>
                        ` : nothing }
                    </div>
                </main>
                <footer>
                    <ext-button @click=${this._cancel} class="btn-outline btn-danger">Cancel</ext-button>
                    <ext-button @click=${this._save} class="btn-success" type="submit">Save</ext-button>
                </footer>
            </section>
        `
    }
    protected _handleHeaderCheckbox(header: string, checked: boolean) {
        if (checked) {
            // Add header if not already present
            if (!this.headers.includes(header)) {
                this.headers = [...this.headers, header];
            }
        } else {
            // Remove header
            this.headers = this.headers.filter(h => h !== header);
        }

        // Clear error if we have at least one header
        if (this.headers.length > 0 && this._errors.headers) {
            const errors = Object.assign({}, this._errors);
            delete errors.headers;
            this._errors = errors;
        }
    }

    protected _selectAllHeaders(section: 'safe' | 'advanced', select: boolean) {
        const headerList = section === 'safe' ? safeHeaders : advancedHeaders;

        if (select) {
            // Add all headers from this section
            const newHeaders = new Set([...this.headers, ...headerList]);
            this.headers = Array.from(newHeaders);
        } else {
            // Remove all headers from this section
            this.headers = this.headers.filter(h => !headerList.includes(h));
        }

        // Clear error if we have at least one header
        if (this.headers.length > 0 && this._errors.headers) {
            const errors = Object.assign({}, this._errors);
            delete errors.headers;
            this._errors = errors;
        }
    }

    protected _handleInput(event: InputEvent) {
        let { id , value , required} = event.target as HTMLInputElement;
        if(["name", "value", "domains"].includes(id)) {
            this[id] = value.trim();
            // Validate IP address when value changes
            if(id === "value" && value.trim() && !this.randomizeIp) {
                const errors = Object.assign({}, this._errors);
                if(!validateIP(value.trim())) {
                    errors[id] = "Please enter a valid IPv4 or IPv6 address";
                } else {
                    delete errors[id];
                }
                this._errors = errors;
            }
        } else if(id === "allDomains") {
            this.allDomains = (value === "true");
        } else if (id === "includeDomains") {
            this.includeDomains = (value === "true");
        } else if (id === "randomizeInterval") {
            this.randomizeInterval = parseInt(value, 10);
        }

        if(required) {
            const errors = Object.assign({}, this._errors);
            if(value) {
                if(errors[id]) { delete errors[id] }
            } else {
                if(!errors[id]) { errors[id] = chrome.i18n.getMessage(`error_${id}_required`); }
            }
            this._errors = errors;
        }
    }

    protected _handleCheckbox(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.id === "randomizeIp") {
            this.randomizeIp = target.checked;
            // Clear value error if randomizeIp is enabled
            if (this.randomizeIp && this._errors.value) {
                const errors = Object.assign({}, this._errors);
                delete errors.value;
                this._errors = errors;
            }
        } else if (target.id === "useIPv6") {
            this.useIPv6 = target.checked;
        }
    }

    protected _cancel(event: Event) {
        event.preventDefault();
        // @TODO: Show close confirmation when model is dirty
        this._closeModal();
    }

    protected _save(event: Event) {
        event.preventDefault();

        const profile : Partial<Profile> = {
            name: this.name,
            value: this.randomizeIp ? "auto" : this.value, // Placeholder, will be replaced by service worker
            headers: this.headers,
            // @ts-ignore
            includeDomains: this.includeDomains,
            domains: this.domains,
            randomizeIp: this.randomizeIp,
            randomizeInterval: this.randomizeInterval,
            useIPv6: this.useIPv6,
        }

        let errors: { [key: string]: string } = {};

        // Value is only required if randomizeIp is disabled
        const required = this.randomizeIp ? ["name", "headers"] : ["name", "value", "headers"];
        required.forEach((field) => {
            if(!profile[field] || !profile[field].length) {
                errors[field] = chrome.i18n.getMessage(`error_${field}_required`);
            }
        });

        // Validate IP address if not randomizing
        if (!this.randomizeIp && this.value && !validateIP(this.value)) {
            errors.value = "Please enter a valid IPv4 or IPv6 address";
        }

        if(!this.allDomains && (!profile.domains || !profile.domains.length)) {
            errors.domains = chrome.i18n.getMessage(`error_domains_required`);
        }

        if(Object.keys(errors).length) {
            this._errors = errors;
            return;
        }

        if(this.profileId) {
            profile.id = this.profileId;
        }

        this.dispatchEvent(new CustomEvent("editProfile", {
            bubbles: true,
            composed: true,
            detail: profile
        }));

        this._closeModal();
    }

    protected _closeModal() {
        this.dispatchEvent(new CustomEvent("closeModal", {
            bubbles: true,
            composed: true,
        }));
    }
}
