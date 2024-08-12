"use client"

import Report from "./Report";
import React from "react";
import {handleFinish} from "@/app/page";
import { Flag } from "lucide-react";
import Timer from "@/components/Timer";

export default function FinishButton(props: any) {
    return (
        <div>
            {/* Open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn btn-success btn-outline"
                    onClick={() => {
                        document.getElementById('my_modal_2').showModal()
                        handleFinish(props.id)
                    }}>
                        Finished!
                        <Flag/>
                        </button>
                        <dialog id="my_modal_2" className="modal">
                        <div className="modal-box">
                        <h3 className="font-bold text-lg">Report</h3>
                        <h3 className="text-lg flex flex-row">
                        Time Used:
                        <Timer elapsedSeconds={props.elapsedSeconds} freeze={true}/>
        </h3>
    <Report questionInfo={props.questionInfo}/>
</div>
    <form method="dialog" className="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
</div>
)
}