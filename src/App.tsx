import React from 'react';
import './App.css';
import SingleLabelGroup from './SingleLabelGroup';
import MultipleLabelGroup from './MultipleLabelGroup';
import NumericLabelGroup from './NumericLabelGroup';
import { LabelGroup, ImageDocument,  getLabels, getNextImage, commitLabels } from './api';

interface AppProps {};

interface AppState {
  labelGroups?: LabelGroup[];
  imageDocument?: ImageDocument;
};

export default class App extends React.Component<AppProps, AppState> {
  public constructor(props: AppProps) {
    super(props);

    this.state = {};
    getNextImage()
      .then(imgDoc => this.setState({ imageDocument: imgDoc }));
    getLabels()
      .then(labels => this.setState({ labelGroups: labels }));
    window.onkeypress = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const { imageDocument } = this.state;
        if (imageDocument === undefined) {
          return;
        }
        this.commitChanges(imageDocument);
      }
    }
  }

  private commitChanges = async (doc: ImageDocument): Promise<void> => {
    this.setState({ imageDocument: undefined });
    return commitLabels(doc)
      .then(() => {
        getNextImage()
          .then(imgDoc => this.setState({ imageDocument: imgDoc }));
      });
  };

  public render() {
    const { labelGroups, imageDocument } = this.state;
    if (labelGroups === undefined || imageDocument === undefined) {
      return (
        <div className="App">
          <p>Loading...</p>
        </div>
      )
    }
    const labels = labelGroups.map(group => {
      const ind = imageDocument.labels.findIndex(g => g.groupName === group.groupName);
      if (group.groupType === 'multiple') {
        const val = ind !== -1 ? imageDocument.labels[ind].value as string[] : [];
        return (
          <MultipleLabelGroup key={group.groupName}
            groupName={group.groupName}
            labels={group.labels}
            onChange={v => {
              // if we have one, update; otherwise, create!
              const newInd = imageDocument.labels.findIndex(g => g.groupName === group.groupName);
              if (newInd === -1) {
                // add
                imageDocument.labels.push({
                  groupName: group.groupName,
                  groupId: group.groupId,
                  groupType: 'multiple',
                  value: v,
                });
              } else {
                // update
                imageDocument.labels[newInd].value = v;
              }
              this.setState({ imageDocument });
            }}
            value={val}
          />
        );
      } else if (group.groupType === 'single') {
        return (
          <SingleLabelGroup key={group.groupName}
            groupName={group.groupName}
            labels={group.labels}
            onChange={v => {
              // if we have one, update; otherwise, create!
              const newInd = imageDocument.labels.findIndex(g => g.groupName === group.groupName);
              if (newInd === -1) {
                // add
                imageDocument.labels.push({
                  groupName: group.groupName,
                  groupId: group.groupId,
                  groupType: 'single',
                  value: v,
                });
              } else {
                // update
                imageDocument.labels[newInd].value = v;
              }
              this.setState({ imageDocument });
            }}
            value={ind !== -1 ? imageDocument.labels[ind].value as string : undefined}
          />
        );
      } else if (group.groupType === 'numeric') {
        return (
          <NumericLabelGroup key={group.groupName}
            groupName={group.groupName}
            range={group.range}
            onChange={v => {
              // if we have one, update; otherwise, create!
              const newInd = imageDocument.labels.findIndex(g => g.groupName === group.groupName);
              if (v === undefined) {
                if (newInd !== -1) {
                  imageDocument.labels = imageDocument.labels.filter((_, i) => i !== ind);
                }
              } else if (newInd === -1) {
                // add
                imageDocument.labels.push({
                  groupName: group.groupName,
                  groupId: group.groupId,
                  groupType: 'numeric',
                  value: v,
                });
              } else {
                // update
                imageDocument.labels[newInd].value = v;
              }
              this.setState({ imageDocument });
            }}
            value={ind !== -1 ? imageDocument.labels[ind].value as number : undefined}
          />
        );
      } else {
        return null;
      }
    });
    return (
      <div className="App">
        <h1>{imageDocument.filename}</h1>
        <div className="image-container">
          <img src={`https://food-truck-spy.appspot.com/api/snapshots/${imageDocument.bucket}/${imageDocument.key}`} alt="Classify" />
        </div>
        <div className="label-container">
          <div className="label-groups">
            {labels}
          </div>
          <div className="button-group">
            <button
              type="button"
              onClick={() => this.commitChanges(imageDocument)}
            >
              Commit Changes
            </button>
            <button
              type="button"
              onClick={() => {
                imageDocument.labels = [];
                this.commitChanges(imageDocument);
              }}
            >
              Mark as Invalid
            </button>
          </div>
        </div>
      </div>
    );
  }
}
