import React from 'react';
import './LabelGroup.css';

interface SingleLabelGroupProps {
    groupName: string;
    labels: string[];
    value?: string;
    onChange: (newVal: string) => unknown;
};

const SingleLabelGroup: React.FC<SingleLabelGroupProps> = ({ groupName, value, labels, onChange }) => {
    const radios = labels.map(label => {
        return (
            <label>
                <input
                    type="radio"
                    key={label}
                    name={groupName}
                    checked={value === label} 
                    onChange={() => {
                        onChange(label);
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
                {radios}
            </div>
        </div>
    );
};

export default SingleLabelGroup;