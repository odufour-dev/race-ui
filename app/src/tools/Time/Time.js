
export class Time {

    parseHMS(input) {
        if (input == null) return null;
        const s = String(input).trim();
        if (!s) return null;
        const parts = s.split(':').map(p => p.trim());
        // allow ss, mm:ss, hh:mm:ss
        if (parts.length === 1) {
            const sec = Number(parts[0]);
            return Number.isFinite(sec) ? Math.floor(sec) : null;
        }
        if (parts.length === 2) {
            const m = Number(parts[0]);
            const sec = Number(parts[1]);
            if (!Number.isFinite(m) || !Number.isFinite(sec)) return null;
            return Math.floor(m * 60 + sec);
        }
        if (parts.length === 3) {
            const h = Number(parts[0]);
            const m = Number(parts[1]);
            const sec = Number(parts[2]);
            if (![h,m,sec].every(Number.isFinite)) return null;
            return Math.floor(h * 3600 + m * 60 + sec);
        }
        return null;
    }

    formatHMS(secs) {
        const s = Number(secs) || 0;
        const abs = Math.max(0, Math.floor(s));
        const h = Math.floor(abs / 3600);
        const m = Math.floor((abs % 3600) / 60);
        const sec = abs % 60;
        const hh = String(h).padStart(2, '0');
        const mm = String(m).padStart(2, '0');
        const ss = String(sec).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    }

    parseMS(input) {
        if (input == null) return null;
        const s = String(input).trim();
        if (!s) return null;
        const parts = s.split(':').map(p => p.trim());
        if (parts.length === 1) {
            const sec = Number(parts[0]);
            return Number.isFinite(sec) ? Math.floor(sec) : null;
        }
        if (parts.length === 2) {
            const m = Number(parts[0]);
            const sec = Number(parts[1]);
            if (!Number.isFinite(m) || !Number.isFinite(sec)) return null;
            return Math.floor(m * 60 + sec);
        }
        return null;
    }

    formatMS(secs) {
        const s = Number(secs) || 0;
        const abs = Math.max(0, Math.floor(s));
        const m = Math.floor(abs / 60);
        const sec = abs % 60;
        const mm = String(m).padStart(2, '0');
        const ss = String(sec).padStart(2, '0');
        return `${mm}:${ss}`;
    }

}