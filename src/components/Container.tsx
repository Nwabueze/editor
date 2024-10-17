import { Box } from '@chakra-ui/react';
import TextEditor from './TextEditor';


const CenteredContainer = () => {

    return (
        <Box className="flex justify-center items-center h-screen w-[800px] bg-white">
            <Box className="w-full mt-[100px] max-w-[800px] border rounded-t-md h-screen flex flex-col justify-start items-center">
                <Box className="w-full h-full mt-[50px] border-t  px-6 py-4">
                    <TextEditor />
                </Box>
            </Box>
        </Box>
    );
};

export default CenteredContainer;
