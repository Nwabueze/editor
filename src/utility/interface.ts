export type ContentType = { 
    fontSize: number, textAlignment: string, contentType: 'text'|'file'|'image'|'video'|'video-url'|'image-url'|'html',
    isBold: boolean, isItalic: boolean, isListType: boolean, isOrderedList: boolean, fileExtension: string, content:TextContent,
    fileContent: string, 
}
export type TextContent = {text: string, listItems: string[]}