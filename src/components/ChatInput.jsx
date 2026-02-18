import { useRef, useState } from "react";


export default function ChatInput({ onSend, disabled }) {


const [value, setValue] = useState("");

const [image, setImage] = useState(null);

const [preview, setPreview] = useState(null);

const fileRef = useRef(null);

const textareaRef = useRef(null);




//////////////////////////////////////////////////
// SEND NORMAL MESSAGE
//////////////////////////////////////////////////

function send(mode = "chat") {

if (!value.trim() && !image) return;

onSend(value, image, mode);


setValue("");

setImage(null);

setPreview(null);


if (fileRef.current)
fileRef.current.value = "";


if (textareaRef.current)
textareaRef.current.style.height = "auto";

}




//////////////////////////////////////////////////
// HANDLE IMAGE SELECT
//////////////////////////////////////////////////

function handleFileChange(e) {

const file = e.target.files?.[0];

if (!file) return;

setImage(file);

setPreview(URL.createObjectURL(file));

}




//////////////////////////////////////////////////
// AUTO RESIZE TEXTAREA
//////////////////////////////////////////////////

function autoResize(e) {

e.target.style.height = "auto";

e.target.style.height =
Math.min(e.target.scrollHeight, 160) + "px";

}




//////////////////////////////////////////////////
// UI
//////////////////////////////////////////////////

return (

<div className="p-4 border-t border-white/10 space-y-3">



{/* IMAGE PREVIEW */}

{preview && (

<div className="relative w-32">

<img

src={preview}

className="rounded-lg border border-white/20"

/>


<button

onClick={() => {

setImage(null);

setPreview(null);

}}

className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full"

>

×

</button>

</div>

)}





<div className="flex items-end gap-2">




{/* IMAGE PICKER */}

<button

type="button"

onClick={() => fileRef.current?.click()}

disabled={disabled}

className="h-11 w-11 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20"

title="Upload image"

>

📷

</button>



<input

ref={fileRef}

type="file"

accept="image/*"

className="hidden"

onChange={handleFileChange}

/>





{/* TEXT INPUT */}

<textarea

ref={textareaRef}

rows={1}

value={value}

disabled={disabled}

onChange={(e) => {

setValue(e.target.value);

autoResize(e);

}}

onKeyDown={(e) => {

if (e.key === "Enter" && !e.shiftKey) {

e.preventDefault();

send("chat");

}

}}

placeholder="Ask Acinyx anything…"

className="

flex-1

resize-none

rounded-lg

bg-white/10

p-3

text-white

outline-none

focus:ring-1

focus:ring-blue-400

max-h-40

overflow-y-auto

"

/>





{/* HUMANIZE BUTTON */}

<button

onClick={() => send("humanize")}

disabled={disabled}

className="

h-11

px-3

rounded-lg

bg-purple-500

hover:bg-purple-600

text-white

text-sm

font-semibold

"

title="Humanize text"

>

Humanize

</button>





{/* GENERATE IMAGE BUTTON */}

<button

onClick={() => send("image")}

disabled={disabled}

className="

h-11

px-3

rounded-lg

bg-green-500

hover:bg-green-600

text-white

text-sm

font-semibold

"

title="Generate image"

>

Image

</button>





{/* SEND BUTTON */}

<button

onClick={() => send("chat")}

disabled={disabled}

className="

h-11

px-5

rounded-lg

bg-blue-500

hover:bg-blue-600

text-white

font-semibold

"

>

Send

</button>



</div>


</div>

);

}
