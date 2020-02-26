import React from 'react';
import './LabelGroup.css';

interface SingleLabelGroupProps {
    groupName: string;
    labels: string[];
    value?: string;
    onChange: (newVal: string) => unknown;
};

const SingleLabelGroup: React.FC<SingleLabelGroupProps> = ({ groupName, value, labels, onChange }) => {
    const radios = labels.map((label, i) => {
        return (
            <label key={label}>
                <input
                    type="radio"
                    key={label}
                    tabIndex={i}
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
    const left: JSX.Element[] = [];
    const right: JSX.Element[] = [];
    for (let i = 0; i < radios.length; i += 2) {
        left.push(radios[i]);
        right.push(radios[i+1]);
    }
    return (
        <div className="label-group">
            <p className="group-title">{groupName}</p>
            <div className="group-labels">
                <div className="left-labels">
                    {left}
                </div>
                <div className="right-labels">
                    {right}
                </div>
            </div>
        </div>
    );
};

export default SingleLabelGroup;