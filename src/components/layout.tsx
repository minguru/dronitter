import { Outlet } from 'react-router-dom'

export default function layout() {
    return (
        <>
            <h2>Layout</h2>
            <Outlet/>
        </>
    )
}
