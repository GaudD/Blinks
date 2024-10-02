import { ActionGetResponse, ACTIONS_CORS_HEADERS } from "@solana/actions"

export const GET = async (req : Request) => {

    const payload: ActionGetResponse = {
        icon: new URL("/img.jpg", new URL(req.url).origin).toString(),
        label: "Enter the contest",
        description: "Enter the contest via this BLINK i made",
        title: "CONTEST",
        links: {
            actions: [
                {
                    href: "/api/actions/donate?amount={amount}",
                    label: "Send",  // buttom name
                    parameters: [
                        {
                            name: "amount", // name of the thing to be replaced in the href
                            label: "Enter a SOL amount" // placeholder in the input box
                        },
                        {
                            name: "Thank you Note",
                            label:"THank You Note"
                        }
                    ],
                    type: "transaction"
                }
            ],
        },
    }

    return Response.json(payload, {
        status: 200,
        headers: ACTIONS_CORS_HEADERS
    })
}

export const OPTIONS = GET;

