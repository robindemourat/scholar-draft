import React, { Component } from 'react';
import PropTypes from 'prop-types';

import AssetButton from '../ToolbarButtons/AssetButton';
import NoteButton from '../ToolbarButtons/NoteButton';

import {
  INLINE_ASSET,
  BLOCK_ASSET
} from '../../constants';
  
import './SideControl.scss';

export default class SideControl extends Component {

  static propTypes = {
    toggleBlockType: PropTypes.func,
    selectedBlockType: PropTypes.string,
  };

  render = () => {

    const { 
      buttons,
      editorState,
      onAssetRequest,
      onAssetRequestCancel,
      onAssetChoice,
      assetChoiceData = {},
      onNoteAdd,
      allowAssets = {
        // inline: true,
        // block: true
      },
      assetRequestPosition,

      BlockAssetChoiceComponent,

      allowNotesInsertion = false
            
    } = this.props;

    const onAssetButtonClick = e => {
      e.stopPropagation();
      if (assetRequestPosition) {
        onAssetRequestCancel();
      } else {
        const currentSelection = editorState && editorState.getSelection();
        onAssetRequest(currentSelection);
      }
    };

    const bindToolbar = (toolbar) => {
      this.toolbar = toolbar;
    };
    return (
      <div
        className="scholar-draft-SideControl"
        ref={bindToolbar}
      >
        {allowNotesInsertion && 
        <NoteButton 
          onClick={onNoteAdd} 
        />
        }
        {(allowAssets.inline || allowAssets.block) && 
        <AssetButton 
          onClick={onAssetButtonClick} 
          active={assetRequestPosition}
        />}
        {assetRequestPosition &&
          <span className="block-asset-choice-container">
            <BlockAssetChoiceComponent
              {...assetChoiceData}
              onAssetChoice={onAssetChoice}
            />
          </span>
        }
      </div>
    );
  }
}
