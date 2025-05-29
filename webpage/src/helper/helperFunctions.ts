import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function generateUUID() {
  return uuidv4();
}

enum NITEnum {
  Photo,
  Logo,
  None
}

interface BaseEntry {
  id: string; // Or the appropriate ID type
}


function debounce<T extends (...args:Parameters<T>)=> void>(func:T,delay:number):(...args:Parameters<T>)=>void {
  let timer: ReturnType<typeof setTimeout>;
  
  return (...args:Parameters<T>)=>{
    clearTimeout(timer);
    timer = setTimeout(()=>{
      func(...args);
    },delay);
  }
    
  }

  // Function to format date from YYYY-MM to MMM YYYY
function formatMonthYear(dateString:string) {
  if (!dateString || !dateString.match(/^\d{4}-\d{2}$/)) {
    return 'Present';
  }
  
  const [year, month] = dateString.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1);
  
  // Get month name
  const monthName = date.toLocaleString('en-US', { month: 'short' });
  
  // Add period after month name except for May
  const formattedMonth = monthName === 'May' ? 'May' : `${monthName}.`;
  
  return `${formattedMonth} ${year}`;
}


const sanitizeInput = (input:string) => {

  // Dont Disrupt The order because if __bold__ becomes \textbf and 
  // then We change \ to \backslash, then even \textbf will suffer
  let sanitizedInput = input.replace(/\\/g, '\\textbackslash');
  sanitizedInput = sanitizedInput.replace(/%/g, '\\%');
  sanitizedInput = sanitizedInput.replace(/&/g, '\\&');
  sanitizedInput = sanitizedInput.replace(/#/g, '\\#');
  sanitizedInput = sanitizedInput.replace(/\$/g, '\\$');
  sanitizedInput = sanitizedInput.replace(/~/g, '\\~');
  sanitizedInput = sanitizedInput.replace(/{/g, '\\{');
  sanitizedInput = sanitizedInput.replace(/}/g, '\\}');
  sanitizedInput = sanitizedInput.replace(/__bold\[(.*?)\]__/g, '\\textbf{$1}');
  sanitizedInput = sanitizedInput.replace(/__italic\[(.*?)\]__/g, '\\textit{$1}');
  sanitizedInput = sanitizedInput.replace(/_/g, '\\_');
  return sanitizedInput;
}
// This is meant for places where verbatim links need to be shown
// I know a little confusing name but need to use this for places like github links where What you write is what you wnt to see
const sanitizeInputForDisplay = (input:string) => {
  input = input.replace(/https?:\/\//, '');
  input = input.replace(/www\./, '');
  input = input.replace(/\\/g, '/');
  return input;
}

const sanitizeInputForLink = (input:string) => {
  if (!input) return "";
  const trimmedInput = input.trim();
  if (!trimmedInput.startsWith("http://") && !trimmedInput.startsWith("https://")){
    return "https://" + trimmedInput;
  }
  console.log(input)
  input = input.replace(/\\/g, '/');
  console.log(input)
  input = input.replace(/\s/g, '');
  return input;
}


const handleInputChange = <T extends BaseEntry>(setEntries: React.Dispatch<React.SetStateAction<T[]>>,Entries:T[],index:number, key:string, value:string) => {
  const newEntries = [...Entries]
  newEntries[index] = { ...newEntries[index], [key]: value };
  setEntries(newEntries);
  }
  
  const addItemToSubList = <T extends BaseEntry>(setEntries: React.Dispatch<React.SetStateAction<T[]>>,index:number, listName: keyof T , value:string) => {
    setEntries(prevEntries=> prevEntries.map((entry,idx)=>{
    if(idx === index){
      const currentList = entry[listName];
      if(Array.isArray(currentList)){
        const newList = [...currentList, value]
       
      return {
        ...entry,
        [listName]: newList,
      } as T;
    }
  }
  
    return entry
  }))
  }
  
  const removeItemFromSubList = <T extends BaseEntry>(setEntries: React.Dispatch<React.SetStateAction<T[]>>,index:number, listName: keyof T , listIndex:number) => {
  setEntries(prevEntries => prevEntries.map((entry,idx)=>{
    if (idx === index){
      const currentList = entry[listName];
      if(Array.isArray(currentList)){
        const newList = currentList.filter((_,i) => i !== listIndex);
        return {
          ...entry,
          [listName]: newList,
        } as T;
      }
    }
    return entry
  }))
  
  }
  
  const handleSubListInputChange = <T extends BaseEntry>(setEntries:React.Dispatch<React.SetStateAction<T[]>>,index:number, listName: keyof T , listIndex:number, value:string) => {
   setEntries(prevEntries => prevEntries.map((entry,idx)=>{
    if(idx === index){
      const currentList = entry[listName];
      if(Array.isArray(currentList)){
        currentList[listIndex] = value;
        return {
          ...entry,
          [listName]: currentList,
        } as T;
      }
    }
    return entry
   }))
  }
  
  const addEntry =  <T extends BaseEntry>(
    setEntries: React.Dispatch<React.SetStateAction<T[]>>,
    defaultEntry: Omit<T, 'id'>,
   
  )=>{
   
    setEntries((prevEntries)=> [
      ...prevEntries,
      {...defaultEntry,id: generateUUID() } as T
    ])
  }
  
  const removeEntry = <T extends BaseEntry>(
    setEntries: React.Dispatch<React.SetStateAction<T[]>>,
    index:number
  ) => {
    setEntries((prevEntries) => prevEntries.filter((_,idx) => idx !== index));
  };


  
const handleKeyActiononList = <T extends BaseEntry>(e:React.KeyboardEvent<HTMLInputElement>,setEntries: React.Dispatch<React.SetStateAction<T[]>>,Entries:T[],index:number, key:string)  => {
  if (e.ctrlKey && e.key === 'b'){
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    if (!input) return;
    const value = input.value;
    if (!value) return;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    if (start === null || end === null) return;
    if (start !== end){
      const selectedText = value.slice(start,end);
      const wrapped = `bold[${selectedText}]`;
      const newText = value.slice(0,start) + wrapped + value.slice(end);
      handleInputChange(setEntries,Entries,index,key,newText)
    }
  }

}
const handleKeyActionOnSublist = <T extends BaseEntry> (e:React.KeyboardEvent<HTMLInputElement>, setState:React.Dispatch<React.SetStateAction<T[]>> , listName:keyof T , index:number , listIndex:number) => {

if (e.ctrlKey && (e.key === 'b' || e.key === 'i')){
  e.preventDefault();
  const input = e.target as HTMLInputElement;
  if (!input) return;
  const value = input.value;
  if (!value) return;

  const start = input.selectionStart;
  const end = input.selectionEnd;
 if (start === null || end === null) return;

  if (start!== end){
    const selectedText = value.slice(start, end);
    const wrapped = e.key === 'b' ? `__bold[${selectedText}]__` : `__italic[${selectedText}]__`;
    const newText = value.slice(0, start) + wrapped + value.slice(end);
    handleSubListInputChange(setState,index,listName,listIndex,newText)
  }
  
}
}

const api = axios.create({
  
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export {
  generateUUID,
  formatMonthYear,
  sanitizeInput,
  sanitizeInputForDisplay,
  sanitizeInputForLink,
  handleInputChange,
  addItemToSubList,
  removeItemFromSubList,
  handleSubListInputChange,
  addEntry,
  removeEntry,
  debounce,
  handleKeyActiononList,
  handleKeyActionOnSublist,
  type BaseEntry,
  NITEnum,
  api
}