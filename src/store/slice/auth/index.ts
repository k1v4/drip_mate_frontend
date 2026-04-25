import { createSlice } from "@reduxjs/toolkit"
import { IAuthState } from "../../../common/types/auth"

const initialState: IAuthState = {
    user: { UserId: null },
    isLogged: false,
    accessLevel: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload
            state.isLogged = true
            state.accessLevel = action.payload.access_id ?? null
        },
        logout(state) {
            state.user = { UserId: null }
            state.isLogged = false
            state.accessLevel = null
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer