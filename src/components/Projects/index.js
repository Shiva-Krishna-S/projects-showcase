import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    activeOptionId: 'ALL',
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.projects.map(project => ({
        id: project.id,
        imageUrl: project.image_url,
        name: project.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeCategory = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectsList)
  }

  renderProjectsListView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list-container">
        {projectsList.map(eachProject => (
          <li key={eachProject.id} className="project-item">
            <img
              src={eachProject.imageUrl}
              alt={eachProject.name}
              className="project-image"
            />
            <p className="project-name">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div className="projects-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color=" #328af2" height="50" width="50" />
    </div>
  )

  onRetry = () => {
    this.getProjectsList()
  }

  renderFailureView = () => (
    <div className="projects-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="projects-failure-img"
      />
      <h1 className="projects-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="projects-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" onClick={this.onRetry} className="retry-button">
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {categoriesList} = this.props
    const {activeOptionId} = this.state
    return (
      <>
        <nav className="navbar">
          <div className="navbar-sub-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
              alt="website logo"
              className="logo"
            />
          </div>
        </nav>
        <div className="content-container">
          <div className="content-sub-container">
            <select
              value={activeOptionId}
              onChange={this.onChangeCategory}
              className="select-container"
            >
              {categoriesList.map(eachItem => (
                <option
                  key={eachItem.id}
                  value={eachItem.id}
                  className="option"
                >
                  {eachItem.displayText}
                </option>
              ))}
            </select>
            {this.renderProjects()}
          </div>
        </div>
      </>
    )
  }
}

export default Projects
