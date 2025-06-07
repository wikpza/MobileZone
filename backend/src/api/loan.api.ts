import express, {NextFunction, Request, Response} from "express";
import {RequestValidator} from "../utils/requestValidator";
import {AuthenticatedRequest, checkPermission, checkTokenJWT} from "./middlewares/user.middlewares";
import {BaseError} from "../utils/error";
import {logger} from "../utils/logger";
import {LoanRepository} from "../repository/Loan.repository";
import {CreateLoanRequest, PayLoanRequest} from "../dto/loan.dto";


const router = express.Router()
const loanRepository = new LoanRepository()
router.post("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{

            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["loan_take"], req.user?.id)


            const {errors, input} = await RequestValidator(
                CreateLoanRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))



            await loanRepository.createLoan(
                {
                    loanSum:req.body.loanSum,
                    procentStavka:req.body.procentStavka,
                    periodYear:req.body.periodYear,
                    penyaStavka:req.body.penyaStavka,
                    employeeId:req.user.id
                }
            )

            return res.status(201).json({message:"success"})
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })
router.get("/",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission([ "loan_take", "loan_pay", 'loan_list'], req.user?.id)

            const {page, limit, sortBy } = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
            const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)

            const budget = await loanRepository.getLoanList(
                {
                    page:parsedPage,
                    limit:parsedLimit,
                    sortBy: sortBy? sortBy as string : 'createdAt',
                }
            )
            return res.status(201).json(budget)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })
router.get("/payment/count",
    checkTokenJWT,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {

        if(!req.user || !req.user.id){
            return res.status(403).json("access denied")
        }
        await checkPermission([ "loan_pay"], req.user?.id)

        const { giveDate, loanId } = req.query;

        // Check if loanId and giveDate are provided, and parse correctly
        if (!loanId || !giveDate) {
            return res.status(400).json({ message: 'Missing required parameters: loanId or giveDate' });
        }

        // Convert loanId to number and parse giveDate as Date
        const parsedLoanId = Number(loanId);
        const parsedGiveDate = new Date(giveDate as string);

        if (isNaN(parsedLoanId)) {
            return res.status(400).json({ message: 'Invalid loanId provided' });
        }

        if (isNaN(parsedGiveDate.getTime())) {
            return res.status(400).json({ message: 'Invalid giveDate provided' });
        }

        const budget = await loanRepository.countPayLoan({
            giveDate: parsedGiveDate,
            loanId: parsedLoanId,
        });

        return res.status(200).json(budget); // HTTP 200 for success
    } catch (error) {
        const err = error as BaseError;
        logger.error(err);
        return res.status(err.status || 500).json(JSON.stringify({ message: err.message, details: err.details || {} }, null, 2));
    }
});
router.post("/payment",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{
            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["loan_pay"], req.user?.id)

            const {errors, input} = await RequestValidator(
                PayLoanRequest,
                req.body
            )
            if(errors) return res.status(400).json(JSON.stringify({message:"bad request",details:errors || {}}, null, 2))


            await loanRepository.payLoan(
                {
                    employeeId:req.user.id,
                    giveDate: req.body.giveDate,
                    loanId:req.body.loanId
                }
            )

            return res.status(201).json({message:"success"})
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })
router.get("/payment",
    checkTokenJWT,
    async (req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
        try{

            if(!req.user || !req.user.id){
                return res.status(403).json("access denied")
            }
            await checkPermission(["loan_pay", "loan_list"], req.user?.id)


            const {page, limit, sortBy, loanId, beforeDate, toDate} = req.query;

            const parsedPage = page ? parseInt(page as string, 10) : 1;  // Страница (по умолчанию 1)
            const parsedLimit = limit ? parseInt(limit as string, 10) : 30;  // Лимит (по умолчанию 10)
            const parsedLoanId = loanId ? parseInt(loanId as string, 10) : undefined;

            const parsedBeforeDate = beforeDate ? new Date(beforeDate as string) : undefined;
            const parsedToDate = toDate ? new Date(toDate as string) : undefined;


            const budget = await loanRepository.getLoanPaymentHistory(
                {
                    page:parsedPage,
                    limit:parsedLimit,
                    sortBy: sortBy? sortBy as string : 'createdAt',
                    loanId:parsedLoanId,
                    beforeDate:parsedBeforeDate,
                    toDate:parsedToDate
                }
            )
            return res.status(201).json(budget)
        }catch(error){
            const err = error as BaseError
            logger.error(err)
            return res.status(err.status).json(JSON.stringify({message:err.message,details:err.details || {}}, null, 2))
        }
    })

export default router