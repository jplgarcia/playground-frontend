import { getNotices, getNotice } from "@mugen-builders/client";
import { useSetChain } from "@web3-onboard/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import networkFile from "./networks.json";
const config = networkFile;
let apiURL = "https://jplayground.fly.dev/graphql";
export const Notice = (props) => {
    const connectedChain = props.chain;
    const [notices, setNotices] = useState([])
    // if (config[connectedChain.id]?.graphqlAPIURL) {
        apiURL = `${config[connectedChain.id].graphqlAPIURL}/graphql`;
    // } else {
    //     console.error(`No inspect interface defined for chain ${connectedChain.id}`);
    //     return;
    // }
    const getAllNotices = async () => {
        const Notices = await getNotices(apiURL, props.index);
        setNotices(Notices);
        setNotices(Notices.map((n) => {
            let inputPayload = n?.input.payload;
            if (inputPayload) {
                try {
                    inputPayload = ethers.utils.toUtf8String(inputPayload);
                } catch (e) {
                    inputPayload = inputPayload + " (hex)";
                }
            } else {
                inputPayload = "(empty)";
            }
            let payload = n?.payload;
            if (payload) {
                try {
                    payload = ethers.utils.toUtf8String(payload);
                } catch (e) {
                    payload = payload + " (hex)";
                }
            } else {
                payload = "(empty)";
            }
            return {
                id: `${n?.id}`,
                index: parseInt(n?.index),
                payload: `${payload}`,
                input: n ? { index: n.input.index, payload: inputPayload } : {},
            };
        }).sort((b, a) => {
            if (a.input.index === b.input.index) {
                return b.index - a.index;
            } else {
                return b.input.index - a.input.index;
            }

        })
        );
    }

    useEffect(() => {
        getAllNotices();
    }, [apiURL])
    return (
        <div>
            <button onClick={() => getAllNotices()}>
                Reload
            </button>

            <table>
                <thead>
                    <tr>
                        <th>Input Index</th>
                        <th>Notice Index</th>
                        {/* <th>Input Payload</th> */}
                        <th>Payload</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.length === 0 && (
                        <tr>
                            <td colSpan={4}>no notices</td>
                        </tr>
                    )}

                    {notices.map((n) => (
                        <tr key={`${n.input.index}-${n.index}`}>
                            <td>{n.input.index}</td>
                            <td>{n.index}</td>
                            {/* <td>{n.input.payload}</td> */}
                            <td>{n.payload}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};
