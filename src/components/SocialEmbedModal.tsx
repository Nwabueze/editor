import React, { useState, useRef } from 'react';
import {
  Box, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Select, Textarea, useDisclosure
} from '@chakra-ui/react';

const SocialEmbedModal = ({ isOpen, onClose, onEmbed }: { isOpen: boolean, onClose: () => void, onEmbed: (content: string) => void }) => {
  const [linkType, setLinkType] = useState<'URL' | 'Code'>('URL');
  const [socialMediaURL, setSocialMediaURL] = useState('');
  const [socialMediaCode, setSocialMediaCode] = useState('');
  const [previewContent, setPreviewContent] = useState('');

  const handleLinkTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLinkType(e.target.value as 'URL' | 'Code');
    setSocialMediaURL('');
    setSocialMediaCode('');
    setPreviewContent('');
  };

  const handleURLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setSocialMediaURL(url);
    setPreviewContent(url);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const code = e.target.value;
    setSocialMediaCode(code);
    setPreviewContent(code);
  };

  const handleEmbed = () => {
    let embedContent = '';
  
    if (linkType === 'URL') {
      const urlPattern = new RegExp('^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w\\-]{2,}(\\/.*)?$');
      if (!urlPattern.test(socialMediaURL)) {
        alert('Please enter a valid URL.');
        return;
      }
  
      
      const allowedDomains = ['youtube.com', 'vimeo.com', 'facebook.com'];
      const urlDomain = new URL(socialMediaURL).hostname;
  
      if (allowedDomains.some(domain => urlDomain.includes(domain))) {
        embedContent = `<iframe src="${socialMediaURL}" width="500" height="300" frameborder="0" allowfullscreen></iframe>`;
      } else {
        alert('Embedding this URL is not allowed. Please provide an embeddable URL.');
        return;
      }
    } else {
      const iframePattern = /<iframe.*<\/iframe>|<embed.*<\/embed>/i;
      if (!iframePattern.test(socialMediaCode)) {
        alert('Please enter valid embed code (iframe or embed).');
        return;
      }
      embedContent = socialMediaCode;
    }
  
    onEmbed(embedContent);
    onClose();
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>EMBED</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>SOCIAL MEDIA LINK TYPE</FormLabel>
            <Select value={linkType} onChange={handleLinkTypeChange}>
              <option value="URL">URL</option>
              <option value="Code">Code</option>
            </Select>
          </FormControl>

          {linkType === 'URL' && (
            <FormControl mb={4}>
              <FormLabel>URL</FormLabel>
              <Input
                placeholder="Enter social media URL"
                value={socialMediaURL}
                onChange={handleURLChange}
              />
            </FormControl>
          )}

          {linkType === 'Code' && (
            <FormControl mb={4}>
              <FormLabel>Code</FormLabel>
              <Textarea
                placeholder="Enter embed code (iframe, embed, etc.)"
                value={socialMediaCode}
                onChange={handleCodeChange}
              />
            </FormControl>
          )}

          <FormControl mb={4}>
            <FormLabel>PREVIEW</FormLabel>
            <Input
              value={previewContent}
              readOnly
              placeholder={linkType === 'URL' ? 'Preview URL' : 'Preview Code'}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" mr={3} onClick={handleEmbed}>
            EMBED
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SocialEmbedModal


