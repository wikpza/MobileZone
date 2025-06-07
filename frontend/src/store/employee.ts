import {makeAutoObservable, runInAction} from "mobx";

interface Employee{
    id:number,
    login:string,
    lastName:string,
    middleName:string,
    firstName:string,
    phone:string,
}

export default class EmployeeStore{
    private _isAuth: boolean = false;
    private _employee: Employee | null = null

    constructor() {
        makeAutoObservable(this);
    }

    setIsAuth(bool:boolean){
        runInAction(()=>{
            this._isAuth = bool
        })
    }

    resetEmployee() {
        runInAction(() => {
            this._isAuth = false;
            this._employee = null;
        });
        localStorage.setItem("token", "")
    }

    setEmployee(employee: Employee) {
        runInAction(() => {
            this._employee = employee;
        });
    }

    get isAuth() {
        return this._isAuth;
    }

    get employee() {
        return this._employee;
    }

}