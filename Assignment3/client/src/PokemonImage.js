function PokeImage(props) {

    const img_style = {
        width: "150px",
        height: "150px",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto"
    }

    return (
        <>
            <img src={`https://github.com/fanzeyi/pokemon.json/raw/master/images/${props.id}.png`} alt="" style={img_style} onClick={props.handleOpen}/>
        </>
    );
}

export default PokeImage;