import React from 'react';
import './LabelGroup.css';

interface MultipleLabelGroupProps {
    groupName: string;
    labels: string[];
    value: string[];
    onChange: (newVal: string[]) => unknown;
};

const MultipleLabelGroup: React.FC<MultipleLabelGroupProps> = ({ groupName, labels, value, onChange }) => {
    const checks = labels.map(label => {
        return (
            <label>
                <input
                    type="checkbox"
                    key={label}
                    checked={value.includes(label)} 
                    onChange={() => {
                        let fedValue: string[];
                        if (value.includes(label)) {
                            fedValue = value.filter(v => v !== label);
                        } else {
                            fedValue = [...value, label];
                        }
                        onChange(fedValue);
                    }}
                    />
                {label}
            </label>
        )
    });
    return (
        <div className="label-group">
            <p className="group-title">{groupName}</p>
            <div className="group-labels">
                {checks}
            </div>
        </div>
    );
};

export default MultipleLabelGroup;