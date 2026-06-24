/**
 * Formats a date string, Date object, or timestamp to a human-readable relative time string
 * (e.g. "3 days ago", "3 minutes ago", "4 days ago", "14 days ago", "3 months ago")
 * using the native ECMAScript Intl.RelativeTimeFormat API.
 */
export function formatRelativeTime(dateInput: string | Date | number | null | undefined): string {
    if (!dateInput) return '—';

    const date = typeof dateInput === 'string' || typeof dateInput === 'number'
        ? new Date(dateInput)
        : dateInput;

    if (isNaN(date.getTime())) return '—';

    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    
    // Calculate differences
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'always' });

    if (Math.abs(diffSecs) < 60) {
        // Fallback to "just now" if it's within a few seconds (optional, but standard)
        if (Math.abs(diffSecs) < 5) {
            return 'just now';
        }
        return rtf.format(diffSecs, 'second');
    } else if (Math.abs(diffMins) < 60) {
        return rtf.format(diffMins, 'minute');
    } else if (Math.abs(diffHours) < 24) {
        return rtf.format(diffHours, 'hour');
    } else if (Math.abs(diffDays) < 30) {
        return rtf.format(diffDays, 'day');
    } else if (Math.abs(diffMonths) < 12) {
        return rtf.format(diffMonths, 'month');
    } else {
        return rtf.format(diffYears, 'year');
    }
}
