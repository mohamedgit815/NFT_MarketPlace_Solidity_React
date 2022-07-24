import NavBar from "../pages/NavBar";

export default function Layout(props) {
    return (
      <div>
       <NavBar/>
       {props.children}
      </div>
    )
  }
  