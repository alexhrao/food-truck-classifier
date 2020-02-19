import React from 'react';
import './LabelGroup.css';

interface NumericLabelGroupProps {
    groupName: string;
    range: number[];
    value?: number;
    onChange: (newVal?: number) => unknown;
};

const NumericLabelGroup: React.FC<NumericLabelGroupProps> = ({ groupName, range, value, onChange }) => {
    let rangeDescription: string;
    if (range[1] < range[0]) {
        rangeDescription = `Enter a number at or above ${range[0]}`;
    } else {
        rangeDescription = `Enter a number between ${range[0]} and ${range[1]}, inclusive`;
    }
    return (
        <div className="label-group">
            <p title={rangeDescription} className="group-title">{groupName}</p>
            <div className="group-labels">
                <input
                    title={rangeDescription}
                    type="number"
                    value={value}
                    min={range[0]}
                    max={range[1] < range[0] ? undefined : range[1]}
                    onChange={e => onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                />
            </div>
        </div>
    );
};

export default NumericLabelGroup;