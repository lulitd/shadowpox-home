import React from "react";
import { Text } from "rebass"

const BodyText = props => {
    return <Text
        {...props}
        sx={{
            p: 2,
            color: 'text',
            fontFamily:'body'
        }}
    />
}

export default BodyText; 