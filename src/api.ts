
interface CategoryLabelGroup {
    groupName: string;
    groupId: string;
    groupType: 'single'|'multiple';
    labels: string[];
}

interface NumericLabelGroup {
    groupName: string;
    groupId: string;
    groupType: 'numeric';
    range: number[];
}

export type LabelGroup = CategoryLabelGroup | NumericLabelGroup;


interface SingleImageLabel {
    groupName: string;
    groupId: string;
    groupType: 'single';
    value: string;
}

interface MultipleImageLabel {
    groupName: string;
    groupId: string;
    groupType: 'multiple';
    value: string[];
}

interface NumericImageLabel {
    groupName: string;
    groupId: string;
    groupType: 'numeric';
    value: number;
}

export type ImageLabelGroup = SingleImageLabel | MultipleImageLabel | NumericImageLabel;

export interface ImageDocument {
    key: string;
    bucket: string;
    filename: string;
    valid: boolean;
    seen: boolean;
    labels: ImageLabelGroup[];
}

export const getLabels = async (): Promise<LabelGroup[]> => {
    return fetch('https://food-truck-spy.appspot.com/api/labels')
        .then(resp => resp.json() as Promise<LabelGroup[]>)
        .then(labels => {
            return labels.map(group => {
                if (group.groupType === 'multiple' || group.groupType === 'single') {
                    group.labels.sort();
                    if (group.labels.includes('none')) {
                        group.labels = ['none', ...group.labels.filter(l => l !== 'none')];
                    }
                }
                return group;
            })
        })
}

export const getNextImage = async (): Promise<ImageDocument> => {
    return fetch('https://food-truck-spy.appspot.com/api/images/')
        .then(resp => resp.json() as Promise<ImageDocument>);
}

export const commitLabels = async (doc: ImageDocument): Promise<unknown> => {
    return fetch(`https://food-truck-spy.appspot.com/api/images/${doc.bucket}/${doc.key}`, {
        body: JSON.stringify(doc.labels),
        method: 'PUT'
    });
}