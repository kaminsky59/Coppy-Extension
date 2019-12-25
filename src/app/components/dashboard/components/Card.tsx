import * as React from 'react';
import { CopyEntry } from '../../../models/dashboard/copyEntry';
import * as $ from 'jquery';

interface props {
  entry:CopyEntry, 
  onDeleteClicked(string),
  onTextClicked(),
};

export default function CoppyCard(props:props) {

  var onCopyClicked = () => {
    console.log('Copy Clicked')
  }

  var onDeleteClicked = () => {
    props.onDeleteClicked(props.entry.id);
    const id = '#' + props.entry.id;
    toggleCard(id);
    props.onTextClicked();
  }

  var onTextClicked = () => {
    const id = '#' + props.entry.id;
    toggleCard(id);
    props.onTextClicked();
  }

  function toggleCard(id) {
    $('.coppy-card').not(id).toggleClass('hidden');
    $(id).toggleClass('open');
    $('.buttons').toggleClass('open');
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
          <p className="text" onClick={onTextClicked}>{props.entry.text}</p>
          <span>Added On: {props.entry.date.toLocaleString()}</span>
          <span>Url: {props.entry.url}</span>
        </div>
      </div>
    </div>
  );
}