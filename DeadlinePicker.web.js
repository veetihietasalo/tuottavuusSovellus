// Web stand-in for @react-native-community/datetimepicker, which renders nothing on the web.
// It covers what Task.js uses: value (a Date), mode="date" and onChange(event, date).
import React from 'react';

const pad = (n) => String(n).padStart(2, '0');
const toInputValue = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export default function DeadlinePicker({ value, onChange }) {
    return (
        <input
            type="date"
            aria-label="Deadline"
            value={toInputValue(value)}
            onChange={(event) => {
                if (!event.target.value) return;
                const [year, month, day] = event.target.value.split('-').map(Number);
                const date = new Date(value);
                date.setFullYear(year, month - 1, day);
                onChange({ type: 'set' }, date);
            }}
            style={{ fontSize: 16, padding: 6, marginBottom: 10 }}
        />
    );
}
