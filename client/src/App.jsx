import { Button, Card, Label, TextInput, Textarea } from 'flowbite-react'
import { useState, useEffect } from 'react'

const App = () => {
  const [data, setData] = useState({
    title: '',
    desc: ''
  })
  const [notes, setNotes] = useState([])
  const [update, setUpdate] = useState(false)
  const [updateId, setUpdateId] = useState("")
  const [deleteId, setDeleteId] = useState("")
  useEffect(() => {
    const temp = async () => {
      try {
        const temp = await fetch("/api/notes")
        const res = await temp.json()
        console.log("notes", res)
        setNotes(res.notes)
      } catch (error) {
        console.log(error)
      }
    }
    temp()
  }, [])
  const handleChange = e => {
    setData({
      ...data,
      [e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const temp = await fetch("/api/notes/create", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const res = await temp.json()
      console.log(res)
      setNotes([
        ...notes,
        res.note
      ])
      setData({
        title: "",
        desc: ""
      })
    } catch (error) {
      console.log(error)
    }
    console.log(data)
  }

  const handleUpdate = async e => {
    e.preventDefault()
    try {
      const temp = await fetch(`/api/notes/update/${updateId}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(data)
      })
      const res = await temp.json()
      console.log(res)
      const newNotes = notes.filter(item => item._id !== updateId)
      setNotes([
        ...newNotes,
        data
      ])
      setUpdateId("")
      setData({
        title: '',
        desc: ''
      })
      setUpdate(false)
    } catch (error) {
      console.log(error)
    }
    console.log(data)
  }

  useEffect(() => {
    const handleDelete = async e => {
      try {
        const temp = await fetch(`/api/notes/delete/${deleteId}`, {
          method: "delete"
        })
        const res = await temp.json()
        console.log(res)
        const newNotes = notes.filter(item => item._id !== deleteId)
        setNotes(newNotes)
        setDeleteId("")
      } catch (error) {
        console.log(error)
      }
      console.log(data)
    }
    if(deleteId) handleDelete()
  }, [deleteId])

  

  console.log(data, notes)
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <main className='p-5 flex justify-center items-center gap-10 h-[80%] w-[70%] border border-teal-300 bg-gradient-to-r to-teal-200 from-red-200'>
        <div className="left flex flex-col gap-4 mr-10">
          <Label className='text-xl' value='Save/Update Note'/>
          <form className='flex flex-col gap-2 w-[20rem]' onSubmit={update ? handleUpdate : handleSubmit}>
            <Label value="Note Title" />
            <TextInput value={data.title} id='title' type='text' placeholder='Enter title' onChange={handleChange} />
            <Label value='Description' />
            <Textarea value={data.desc} id='desc' onChange={handleChange} />
            <Button type='submit'>{update ? "Update" : "Save"}</Button>
          </form>
        </div>
        <div className="right flex flex-col gap-4">
        <Label className='text-xl' value='Notes'/>
          <Card>
            <div className='flex flex-col gap-4'>
              {notes.map(item => (
                <div className='flex gap-4 items-center justify-between'>
                  <div>
                  <p className='w-[15rem] break-words'>{item.title}</p>
                  <p className='text-xs text-slate-600 break-words w-[15rem]'>{item.desc}</p>
                  </div>
                  <div className='flex gap-2'>
                  <Button onClick={() => {
                    setUpdate(true)
                    setUpdateId(item._id)
                    setData({
                      title: item.title,
                      desc: item.desc
                    })
                  }}>Update</Button>
                  <Button color="failure" onClick={() => setDeleteId(item._id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

    </div>
  )
}

export default App