export interface IPropsLogin{
    setPassword: (value: string) => void,
    setEmail: (value: string) => void,
    navigate: (to: string) => void
}

export interface IPropsRegister{
    setPassword: (value: string) => void,
    setEmail: (value: string) => void
    setRetryPassword: (value: string) => void,
    setUserName: (value: string) => void,
    navigate: (to: string) => void
}

export interface IAuthState{
    user: IPublicUser,
    isLogged: boolean
}

export interface IPublicUser{
    UserId: number | null
}

export interface IPropsGetArticle{
    navigate: (to: string) => void
}
