import prisma from "../lib/prisma.js"

export const createTrade = async (req,res) =>{

    const {ticker , direction,entryPrice,exitPrice,quantity,entryDate,exitDate,strategy,notes,emotion,screenshot} = req.body;

    try {
        const pnl = (exitPrice-entryPrice)*quantity

        const trade = await prisma.trade.create({
            data:{
                userId : req.userId,
                ticker,
                direction,
                entryPrice,
                exitPrice,
                quantity,
                pnl,
                entryDate: new Date(entryDate),
                exitDate: new Date(exitDate),
                strategy,
                notes,
                emotion,
                screenshot,

            },
        })

        res.status(201).json(trade)
    }catch(error){
        console.error("CREATE TRADE ERROR:",error)
        res.status(500).json({message:"Server error",error:error.message})
    }

}

export const getTrade = async (req,res)=>{
    const {id} = req.params;


    try{
        const trade = await prisma.trade.findFirst({
            where :{id , userId:req.userId},           
    })

        if (!trade){
            return res.status(400).json({message :"trade not found"})
        }

        res.status(200).json(trade);
    }
    catch(error){
        console.error("GET TRADE ERROR:",error)
        res.status(500).json({ message: "Server error", error: error.message })

    }
}


export const updateTrade = async (req, res) => {
  const { id } = req.params
  const { ticker, direction, entryPrice, exitPrice, quantity, entryDate, exitDate, strategy, notes, emotion, screenshot } = req.body

  try {
    const pnl = (exitPrice - entryPrice) * quantity

    const trade = await prisma.trade.update({
      where: { id, userId: req.userId },
      data: {
        ticker,
        direction,
        entryPrice,
        exitPrice,
        quantity,
        pnl,
        entryDate: new Date(entryDate),
        exitDate: new Date(exitDate),
        strategy,
        notes,
        emotion,
        screenshot,
      },
    })

    res.status(200).json(trade)
  } catch (error) {
    console.error("UPDATE TRADE ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}


export const deleteTrade = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.trade.delete({
      where: { id, userId: req.userId },
    })

    res.status(200).json({ message: "Trade deleted" })
  } catch (error) {
    console.error("DELETE TRADE ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

export const getAllTrades = async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.userId },
      orderBy: { entryDate: "desc" },
    })

    res.status(200).json(trades)
  } catch (error) {
    console.error("GET TRADES ERROR:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}