import React from "react";
import { Button } from "rebass"

const MenuButton = props => {
    return <Button
        {...props}
        sx={{
            border:'2px solid',
            borderColor:'currentColor',
            backgroundColor:'white',
            p:3,
            m:[1,2,2],
            color: 'black',
            textAlign:'center',
            '&:hover': {
                background:'black',
                color: 'white',
              },
            '&> span':{
                fontSize:[2,3,4]
            }
        }}
        width={['75px','100px']}
        height={['112.5px','150px']}
    />
}

export default MenuButton; 