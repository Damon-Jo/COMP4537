import React from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import PokemonImage from './PokemonImage'

function Pokemon(props) {
  const getThreeDigitId = (id) => {
    if (id < 10) return `00${id}`
    if (id < 100) return `0${id}`
    return id
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
    fontSize: 30,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
    <div>
      <PokemonImage id={getThreeDigitId(props.pokemon.id)} handleOpen={handleOpen}/>
      <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <div style={{fontWeight: 'bold'}}>Pokemon name : {props.pokemon.name.english}</div>
                    <div style={{fontSize: 20}}>
                      HP: [{props.pokemon.base.HP}]<br/>
                      Attack: [{props.pokemon.base.Attack}]<br/>
                      Defense: [{props.pokemon.base.Defense}]<br/>
                      Sp. Attack: [{props.pokemon.base['Sp. Attack']}]<br/>
                      Speed: [{props.pokemon.base.Speed}]<br/>
                      Types: [
                        {props.pokemon.type.map(item => {
                            return <> {item}, </>
                        })}
                        ] <br/>
                    </div>
                </Box>
            </Modal>
            </div>
    </>
  )
}

export default Pokemon