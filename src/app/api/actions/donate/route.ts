import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const GET = async (req : Request) => {

    const payload: ActionGetResponse = {
        icon: new URL("/img.jpg", new URL(req.url).origin).toString(),
        label: "Buy me a coffee (Chanda Dedo)",
        description: "Buy me a coffee using this BLINK",
        title: "Gaud - Buy me a coffee",
        links: {
            actions: [
                {
                    href: "/api/actions/donate?amount=0.05",
                    label: "0.05 SOL",
                    type: "transaction"
                },{
                    href: "/api/actions/donate?amount=0.1",
                    label: "0.1 SOL",
                    type: "transaction"
                },{
                    href: "/api/actions/donate?amount=0.25",
                    label: "0.25 SOL",
                    type: "transaction"
                },
                {
                    href: "/api/actions/donate?amount={amount}",
                    label: "Send",  // buttom name
                    parameters: [
                        {
                            name: "amount", // name of the thing to be replaced in the href
                            label: "Enter a SOL amount" // placeholder in the input box
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

export const POST = async (req: Request) => {
    try {

        const url = new URL(req.url);
        const body: ActionPostRequest = await req.json();
        let account : PublicKey;

        try {
            account = new PublicKey(body.account);
        } catch {
            throw "Invalid account provided, not a real Public Key"
        }

        let amount : number = 0.05;

        if (url.searchParams.has("amount")) {
            try {
                amount = parseFloat(url.searchParams.get("amount") || "0.05");
            } catch {
                throw "Invalid Amount"
            }
        }

        const connection = new Connection(clusterApiUrl("mainnet-beta"))

        const TO_PUBKEY = new PublicKey("G76xtuTjgT81ywag7fXjAoQNxv7E6DB3SBs21rSQYgrq");

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: account,
                lamports: amount * LAMPORTS_PER_SOL,
                toPubkey:TO_PUBKEY
            })
        );
        transaction.feePayer = account;

        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                type:"transaction",
                transaction,
                message:"Thanks for the coffee fren :)"
            }
        })

        return Response.json(payload, {
            status: 200,
            headers: ACTIONS_CORS_HEADERS
        })

    } catch (error) {
        
        let message = "Unknown error occured";
        if (typeof error == "string") {
            message = error;
        }

        return Response.json({
            message: message
        }, {
            headers: ACTIONS_CORS_HEADERS
        })
    }
}