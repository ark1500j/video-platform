import { atom, useAtom } from "jotai";




const config = atom({email:'',otp:'',password:'',username:''})

const lauth = atom({email:'',otp:'',password:''})
const aauth= atom({email:'', otp:'',password:''})

export function useAuth(){
    return useAtom(config)
}

export function useLauth(){
    return useAtom(lauth)
}

export function useAauth(){
    return useAtom(aauth)
}


