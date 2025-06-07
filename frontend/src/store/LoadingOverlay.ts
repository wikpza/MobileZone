import {makeAutoObservable, runInAction} from "mobx";

export default class LoadingOverlayClass {
    private _isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this); // makeAutoObservable автоматически управляет реактивностью и actions
    }

    setIsLoading(bool:boolean){
        runInAction(() => { // оборачиваем в runInAction

            this._isLoading = bool;
        });
    }

    get isLoading() {
        return this._isLoading;
    }
}