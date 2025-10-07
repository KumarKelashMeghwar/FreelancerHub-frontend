import { createContext, useReducer } from "react";

const initialState = {
    token: null,
    user: null
}


const authReducer = (state, action) => {

    switch(action.type){

        case "LOGIN":
           
            return {
                user: action.payload.user,
                token: action.payload.token
            }

        case "LOGOUT":
            return {
                user: null,
                token: null
            }
        
        default:
            return state
    }

}

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [state, dispatch] = useReducer(authReducer, initialState);

    return <AuthContext.Provider value={{...state, dispatch}}>
        {children}
    </AuthContext.Provider>
}