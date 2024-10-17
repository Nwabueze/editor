
import React, { useState, useRef } from 'react';
import {
    Box, IconButton, Input, FormControl, FormLabel, Menu, MenuButton, MenuList, MenuItem, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Select
} from '@chakra-ui/react';
import { BiBold, BiItalic, BiAlignLeft, BiAlignRight, BiAlignJustify, BiListUl, BiListOl, BiPlus } from 'react-icons/bi';
import { AiFillPicture, AiFillVideoCamera, AiOutlineShareAlt } from 'react-icons/ai';
import SocialEmbedModal from './SocialEmbedModal';



const TextEditor = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [isOrderedListActive, setIsOrderedListActive] = useState(false);
    const [isUnorderedListActive, setIsUnorderedListActive] = useState(false);
    const [orderedCounter, setOrderedCounter] = useState(1); 
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'image' | 'video' | 'social' | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imageName, setImageName] = useState<string>(''); 
    const [videoProvider, setVideoProvider] = useState<string>(''); 
    const [videoURL, setVideoURL] = useState<string>(''); 
    const [openSocialModal, setOpenSocialModal] = useState(false);
    const [title, setTitle] = useState("")
    const [postTitleContent, setPostTitleContent] = useState("")
    

    
    const applyStyle = (command: string) => {
        document.execCommand(command, false, undefined);
        setActiveTool(command);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        const editor = editorRef.current;

        if (event.key === 'Enter') {
            if (isOrderedListActive || isUnorderedListActive) {
                event.preventDefault(); 

                const newDiv = document.createElement('div');
                const fourSpaces = '\u00A0\u00A0\u00A0\u00A0'; 

                if (isOrderedListActive) {
                    newDiv.textContent = `${orderedCounter}. ${fourSpaces}`;
                    newDiv.contentEditable = 'true';
                    newDiv.style.display = 'flex';
                    newDiv.style.alignItems = 'baseline'; 
                    editor?.appendChild(newDiv);
                    setOrderedCounter(orderedCounter + 1); 
                } else if (isUnorderedListActive) {
                    newDiv.textContent = `• ${fourSpaces}`;
                    newDiv.contentEditable = 'true';
                    newDiv.style.display = 'flex';
                    newDiv.style.alignItems = 'baseline';
                    editor?.appendChild(newDiv);
                }

                
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(newDiv);
                range.collapse(false); 
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            } else {
                
                const newDiv = document.createElement('div');
                newDiv.contentEditable = 'true';
                editor?.appendChild(newDiv);
                
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(newDiv);
                range.collapse(false); 
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }
    };

    const handleOrderedList = () => {
        setIsOrderedListActive((prevState) => {
            const newState = !prevState;
            if (newState) {
                insertListItem('ordered');
            } else {
                setOrderedCounter(1); 
            }
            return newState;
        });
        setIsUnorderedListActive(false); 
    };

    const handleUnorderedList = () => {
        setIsUnorderedListActive((prevState) => {
            const newState = !prevState;
            if (newState && !isUnorderedListActive) {
                insertListItem('unordered');
            }
            return newState;
        });
        setIsOrderedListActive(false); 
    };

    
    const insertListItem = (listType: 'ordered' | 'unordered') => {
        const editor = editorRef.current;
        if (editor) {
            const newDiv = document.createElement('div');
            const fourSpaces = '\u00A0\u00A0\u00A0\u00A0'; 

            if (listType === 'ordered') {
                newDiv.textContent = `${orderedCounter}. ${fourSpaces}`;
                newDiv.contentEditable = 'true';
                newDiv.style.display = 'flex';
                newDiv.style.alignItems = 'baseline'; // Align number and text
                setOrderedCounter(orderedCounter + 1); // Increment counter
            } else {
                newDiv.textContent = `• ${fourSpaces}`;
                newDiv.contentEditable = 'true';
                newDiv.style.display = 'flex';
                newDiv.style.alignItems = 'baseline';
            }

            editor.appendChild(newDiv);

            
            const range = document.createRange();
            const selection = window.getSelection();
            range.selectNodeContents(newDiv);
            range.collapse(false); 
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    const alignText = (alignment: string) => {
        document.execCommand('justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1));
    };

    const handleMenuItemClick = (item:'image' | 'video' | 'social' | null) => {
        console.log(`Selected: ${item}`);
        if(item){
            setModalType(item)
            if(item === 'social'){
                setOpenSocialModal(true)
            }else{
                setIsModalOpen(true)
            }
        }
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        if (file) {
            setSelectedImage(file);
            setImageName(file.name); 
        }
    };

    const handleEmbedImage = () => {
        if (selectedImage && editorRef.current) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(selectedImage);
            img.style.maxWidth = '100%'; 
            img.style.borderRadius = '8px'; 
            editorRef.current.appendChild(img);
            setIsModalOpen(false);
            setSelectedImage(null); 
        }
    };

    const handleEmbedVideo = () => {
        if (editorRef.current && videoProvider && videoURL) {
          let embedURL = '';
    
          
          if (videoProvider === 'YouTube') {
            const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
            if (youtubeRegex.test(videoURL)) {
              
              embedURL = videoURL.replace('watch?v=', 'embed/').replace('youtube.com', 'youtube-nocookie.com');
            } else {
              alert('Please enter a valid YouTube URL.');
              return;
            }
          } else if (videoProvider === 'Facebook') {
            const facebookRegex = /^(https?\:\/\/)?(www\.facebook\.com|fb\.watch)\/.+$/;
            if (facebookRegex.test(videoURL)) {
              
              embedURL = videoURL;
            } else {
              alert('Please enter a valid Facebook video URL.');
              return;
            }
          }
    
          
          const newVideo = document.createElement('iframe');
          newVideo.src = embedURL;
          newVideo.style.width = '100%'; 
          newVideo.style.height = '315px'; 
          newVideo.frameBorder = '0';
          newVideo.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          newVideo.allowFullscreen = true;
    
          editorRef.current.appendChild(newVideo);
          setIsModalOpen(false);
          setVideoProvider(''); 
          setVideoURL(''); 
        }
      };

      const handleEmbed = (embedContent: string) => {
        const editor = editorRef.current;
        if (editor) {
          const newDiv = document.createElement('div');
          newDiv.innerHTML = embedContent;
          editor.appendChild(newDiv);
        }
      };

    return (
        <Box className="flex justify-center items-center h-screen w-full bg-white">
            <Box className="w-[100%] max-w-[800px] rounded-t-md h-screen flex flex-col justify-start items-center">
                <Box className="w-full h-full w-[100%] px-6 py-4">
                    {!postTitleContent && <form onSubmit={(e) => { e.preventDefault(); setPostTitleContent(title); }}>
                        <FormControl>
                            <FormLabel className="text-[20px] text-gray-800 mt-[20px] font-bold">Post title</FormLabel>
                            <Input
                                placeholder="Add title here"
                                className="mt-[10px] w-full p-2"
                                variant="unstyled"
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </FormControl>
                    </form>}
                    {postTitleContent && <Box fontWeight='bold' fontSize='20px'>{postTitleContent}</Box>}
                    {/* Toolbar */}
                    <Box className="flex mt-4 space-x-2">
                        <IconButton
                            onClick={() => applyStyle('bold')}
                            aria-label="Bold"
                            icon={<BiBold style={{fontSize: '30px'}}/>}
                            isActive={activeTool === 'bold'}
                            className={`${activeTool === 'bold' ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                        <IconButton
                            onClick={() => applyStyle('italic')}
                            aria-label="Italic"
                            icon={<BiItalic style={{fontSize: '30px'}}/>}
                            isActive={activeTool === 'italic'}
                            className={`${activeTool === 'italic' ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                        <IconButton
                            onClick={alignText.bind(null, 'left')}
                            aria-label="Align Left"
                            icon={<BiAlignLeft style={{fontSize: '30px'}}/>}
                            className={`${activeTool === 'left' ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                        <IconButton
                            onClick={alignText.bind(null, 'center')}
                            aria-label="Align Center"
                            icon={<BiAlignJustify style={{fontSize: '30px'}}/>}
                            className={`${activeTool === 'center' ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                        <IconButton
                            onClick={alignText.bind(null, 'right')}
                            aria-label="Align Right"
                            icon={<BiAlignRight style={{fontSize: '30px'}}/>}
                            className={`${activeTool === 'right' ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                        <IconButton
                            onClick={handleUnorderedList}
                            aria-label="Unordered List"
                            icon={<BiListUl style={{fontSize: '30px'}}/>}
                            isActive={isUnorderedListActive}
                            className={`${isUnorderedListActive ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                        <IconButton
                            onClick={handleOrderedList}
                            aria-label="Ordered List"
                            icon={<BiListOl style={{fontSize: '30px'}}/>}
                            isActive={isOrderedListActive}
                            className={`${isOrderedListActive ? 'bg-gray-300' : 'bg-white'} border-2`}
                        />
                    </Box>

                    
                    <Box
                        ref={editorRef}
                        contentEditable
                        className="mt-4 text-gray-600 border p-4 h-[300px] h-auto focus:outline-none"
                        onKeyDown={handleKeyDown}
                    />

                   
                    <Menu>
                        <MenuButton
                            as={IconButton}
                            icon={<BiPlus />}
                            aria-label="Add"
                            className="mt-4 rounded-full"
                        />
                        <MenuList>
                            <Box fontWeight="bold" px={4} py={2}>
                                EMBEDS
                            </Box>
                            <MenuItem icon={<AiFillPicture />} onClick={() => handleMenuItemClick('image')}>
                                Picture
                            </MenuItem>
                            <MenuItem icon={<AiFillVideoCamera />} onClick={() => handleMenuItemClick('video')}>
                                Video
                            </MenuItem>
                            <MenuItem icon={<AiOutlineShareAlt />} onClick={() => handleMenuItemClick('social')}>
                                Social
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{modalType?.toUpperCase()}</ModalHeader>
                    <ModalBody>
                        {modalType === 'image' && (
                            <Box ml="auto" mr="auto"
                                width="100%"
                                height="150px"
                                border="2px dotted"
                                borderColor="gray.300"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius="8px"
                            >
                                <Box className='flex flex-col gap-[3px]'>
                                    <Box>
                                        <Button onClick={() => document.getElementById('image-upload')?.click()}>
                                            Import Image from Device
                                        </Button>
                                    </Box>
                                    {imageName && <Box className='mt-2 text-center text-[11px]'>{imageName}</Box>}
                                </Box>

                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageSelect}
                                />
                            </Box>
                        )}
                        {modalType === 'video' && (
                            <Box>
                                <FormControl mb={4}>
                                    <FormLabel>VIDEO PROVIDER</FormLabel>
                                    <Select placeholder="Select provider" value={videoProvider} onChange={(e) => setVideoProvider(e.target.value)}>
                                        <option value="YouTube">YouTube</option>
                                        <option value="Facebook">Facebook</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>URL</FormLabel>
                                    <Input
                                        placeholder="Enter video URL"
                                        value={videoURL}
                                        onChange={(e) => setVideoURL(e.target.value)}
                                    />
                                </FormControl>
                            </Box>
                        )}
                    </ModalBody>
                    <ModalFooter className='flex flex-row gap-[15px] w-[100%] ml-auto mr-auto'>
                        {modalType === "image" && <Button colorScheme="green" onClick={handleEmbedImage} disabled={!selectedImage}>
                            EMBED
                        </Button>}
                        {modalType === "video" && <Button colorScheme="blue" onClick={handleEmbedVideo} disabled={!videoProvider || !videoURL}>
                            EMBED
                        </Button>}
                        <Button onClick={() => setIsModalOpen(false)}>CANCEL</Button>
                        <Box ml="auto"></Box>
                        <Box className='w-[10px] h-[10px]'></Box>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {modalType === "social" && <SocialEmbedModal isOpen={openSocialModal} onClose={() => setOpenSocialModal(false)} onEmbed={handleEmbed} />}
        </Box>
    );
};

export default TextEditor;
