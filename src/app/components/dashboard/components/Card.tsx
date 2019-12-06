import * as React from 'react';
import { CopyEntry } from '../../../models/dashboard/copyEntry';

interface props {
  entry:CopyEntry, 
  onDeleteClicked(string)
};

export default function CoppyCard(props:props) {

  var onCopyClicked = () => {
    console.log('Copy Clicked')
  }

  var onDeleteClicked = () => {
    props.onDeleteClicked(props.entry.id);
  }


  return (
    <div className="row coppy-card" id={props.entry.id}>
      <div className="col">
        <div className="icon">
          <img src="images/speach_bubble.svg"></img>
        </div>
        <div className="card-divider"></div>
        <div className="content">
          <div className="ui-group-buttons buttons text-center">
              <button type="button" className="btn btn-danger" onClick={onDeleteClicked}>Delete</button>
              <button type="button" className="button btn btn-success" onClick={onCopyClicked}>Copy</button>
          </div>
          <p className="text">{props.entry.text}</p>
          <span>Added On: {props.entry.date.toLocaleString()}</span>
          <span>Url: {props.entry.url}</span>
        </div>
      </div>
    </div>
  );
}