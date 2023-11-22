import { fireEvent, render, screen} from "@testing-library/react"


import {  rest } from 'msw'
import { setupServer} from 'msw/node'

import Tasks from "./Tasks"

describe('Tasks Component', () => {
    const worker = setupServer(

        rest.get("https://jsonplaceholder.typicode.com/todos", async(req,res,ctx) => {
            return res(
                ctx.json([
                    {
                        "userId": 1,
                        "id": 2,
                        "title": "quis ut nam facilis et officia qui",
                        "completed": false
                      },
                ])
            )
        })
    )

    beforeAll(() => {
        worker.listen()
    })

    beforeEach(() =>{
        worker.resetHandlers()
    })

    it('should fetch and show tasks on button click', async () => {
        render(<Tasks/>)

        const button = screen.getByText(/get tasks from api/i)

        fireEvent.click(button)

        await screen.findByText("quis ut nam facilis et officia qui"
        )
    })

    it('should show error message on fetch error', async () => {
        worker.use(
            rest.get("https://jsonplaceholder.typicode.com/todos", async(req,res,ctx) => {
                return res(
                    ctx.status(500), ctx.json({message: "error happened"})
                )
            })
        )

        
        render(<Tasks />)

        
        const button = screen.getByText(/get tasks from api/i)

        fireEvent.click(button)

        await screen.findByText("Request failed with status code 500")

    })
})