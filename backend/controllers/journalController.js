import prisma from '../lib/prisma.js';


export const createJournal = async (req,res) =>{
    const {date,notes,plans,news} = req.body;

    try{
        const journal = await prisma.journal.create({
            data:{
                userId: req.userId,
                date: new Date(date),
                notes,
                plans,
                news,
            },
        })
        res.status(201).json(journal)
    } catch(error){
        console.error("CREATE JOURNAL ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
}
}

export const getAllJournals = async (req,res) =>{
    try{
        const journals = await prisma.journal.findMany({
            where :{userId: req.userId},
            orderBy : {date:"desc"},
        })
        res.status(200).json(journals)
    }catch(error){
        console.error("GET JOURNALS ERROR:",error)
        res.status(500).json({message:"server error",error:error.message})
    }
}

export const updateJournal = async (req,res)=>{
    const {id} = req.parmas;

    const{date,notes ,plan ,news} = req.body;

    try{
        const journal = await prisma.journal.update({
            where : {id,userId:req.userId},
            data:{
                date: new Date(date),
                notes,
                plans,
                news,
            },
        })
        res.status(200).json(journal)
    }catch(error){
        console.error("UPDATE JORUNAL ERROR:",error)
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const deleteJournal = async (req,res)=>{
    const {id} = req.parmas

    try{
        await prisma.journal.delete({
            where : {id,userId:req.userId}
        })
        res.status(200).json({ message: "Journal deleted" })

    }catch (error) {
    console.error("DELETE JOURNAL ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }

}
export const getJournal = async (req, res) => {
  const { id } = req.params

  try {
    const journal = await prisma.journal.findFirst({
      where: { id, userId: req.userId },
    })

    if (!journal) {
      return res.status(404).json({ message: "Journal not found" })
    }

    res.status(200).json(journal)
  } catch (error) {
    console.error("GET JOURNAL ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}
