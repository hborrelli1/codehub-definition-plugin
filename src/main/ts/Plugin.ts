import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addToggleButton('codehub-definition', {
    text: 'codehub-definition button',

    onAction: () => {
      const getDefinitionName = (value) => {
        const name = tinymce.trim(value);
        return name.toLowerCase().replace(/\W/g, '-');
      }

      editor.execCommand('mceToggleFormat', false, 'codehub-definition');

      // Get selected element.
      const selection = editor.selection;
      console.log('selection: ', selection);
      const selectedContent = selection.getContent();
      console.log('selectedContent: ', selectedContent);

      const selectedNode = selection.getNode();
      console.log('selectedNode: ', selectedNode);
      
      // if selection is not empty
      if (selectedContent.trim() && selectedContent.trim().length > 0) {
        // Look for data attribute.
        const codehubAttribute = editor.dom.getAttrib(selectedNode, 'data-codehub-definition-name', null);
        // const elementClass = editor.dom.getAttrib(selectedNode, 'class', null);
        
        // If attributes already exist...
        if (selectedNode.nodeName === 'SPAN' && codehubAttribute) {
          console.log('is span and has codehubattribute....');
          
          // replace node with just text..
          selectedNode.replaceWith(selectedContent);
        } 

        // If attributes do not exist..
        else {
          // add node with correct attributes. 
          const newEl = editor.dom.createHTML(
            'span', 
            {
              id: getDefinitionName(selectedContent), 
              'data-codehub-definition-name': getDefinitionName(selectedContent), 
              class: 'definition anchor',
            }, 
            selection.getContent()
          );
          console.log('newEl:', newEl);
          editor.execCommand('mceReplaceContent', false, newEl);
        }
      } else {
        alert('Selection cannot be empty...')
      }
    },

    onSetup: (api) => {
      editor.formatter.formatChanged('codehub-definition', (state) => {
        api.setActive(state);
      });
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('codehub-definition', setup);
};
