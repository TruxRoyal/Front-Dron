import React from "react"

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

export default React.memo((props: any) => {
    return (
        <div className ='h-[100vh] w-[100%]'>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={35}>
                    <div className="h-full w-full">
                        <h1 className="text-2xl font-bold">Hello World2!</h1>
                        <p>Welcome to your Electron application.</p>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <div className="h-full w-full">
                        <h1 className="text-2xl font-bold">Hello World1!</h1>
                        <p>Welcome to your Electron application.</p>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>

    )
})