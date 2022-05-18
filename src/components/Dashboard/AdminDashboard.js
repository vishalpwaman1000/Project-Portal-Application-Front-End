import React, { Component } from 'react'
import './AdminDashboard.scss'
import GetProjectList from './GetProjectList'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile'
import VisibilityIcon from '@material-ui/icons/Visibility'
import ArchiveIcon from '@material-ui/icons/Archive'
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import Pagination from '@material-ui/lab/Pagination'
import DeleteIcon from '@material-ui/icons/Delete'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FeedbackIcon from '@material-ui/icons/Feedback'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'
import ProjectServices from '../../services/ProjectServices'
import Switch from '@material-ui/core/Switch'

const projectServices = new ProjectServices()

export default class AdminDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ProjectStatus: 'Private',
      //
      ProjectName: '',
      ProjectDescription: '',
      FrontEndProjectUrl: '',
      BackEndProjectUrl: '',
      ProjectDocumentUrl: '',
      CreatedDate: '',
      IsActive: false,
      //
      ProjectNameFlag: false,
      //
      Message: '',
      //
      NumberOfRecordPerPage: 6,
      //
      PageNumber: 1,
      ArchivePageNumber: 1,
      TrashPageNumber: 1,
      //
      FileDataList: [],
      noteInfo: [],
      TotalPages: 0,
      TotalRecords: 0,

      open: false,
      MenuOpen: false,
      OpenLoader: false,
      OpenSnackBar: false,

      OpenShow: true,
      OpenArchive: false,
      OpenTrash: false,
      OpenFeedBack: false,
      Update: false,
      ShowProjectInfo: false,
      PermenantlyDelete: false,
    }
  }

  componentWillMount() {
    console.log('Component will mount calling ... ')
    this.GetProjectList(this.state.PageNumber, 'Active', true)
  }

  GetProjectList(CurrentPage, Operation) {
    console.log('Get Project List Calling ... ')
    let data = {
      operation: Operation,
      pageNumber: CurrentPage,
      numberOfRecordPerPage: this.state.NumberOfRecordPerPage,
    }

    projectServices
      .GetProjectList(data)
      .then((data) => {
        console.log('Data : ', data)
        if (data.data.data === null && CurrentPage > 1) {
          this.setState({ CurrentPage: CurrentPage - 1 })
          this.GetProjectList(CurrentPage - 1, Operation)
        } else {
          this.setState({
            FileDataList: data.data.data,
            TotalPages: data.data.totalPage,
            PageNumber: CurrentPage,
          })
        }
      })
      .catch((error) => {
        console.log('Error : ', error)
        this.setState({
          Message: 'Something Went Wrong',
          OpenSnackBar: true,
          OpenLoader: false,
        })
      })
  }

  handleSubmit = (e) => {
    console.log('Handle Submit Calling ... ')
    let State = this.state
    this.CheckValidity()
    if (State.ProjectName !== '') {
      this.setState({ OpenLoader: true })
      let data = {
        projectName: State.ProjectName,
        projectDescription: State.ProjectDescription,
        frontEndProjectUrl: State.FrontEndProjectUrl,
        backEndProjectUrl: State.BackEndProjectUrl,
        projectDocumentUrl: State.ProjectDocumentUrl,
        projectStatus: State.ProjectStatus,
        isActive: State.IsActive,
      }
      projectServices
        .UploadProjectDetail(data)
        .then((data) => {
          console.log('Data : ', data)
          this.setState({
            Message: data.data.message,
            OpenSnackBar: true,
            OpenLoader: false,
            open: false,
          })
          this.handleOpenList()
          this.handleClose()
        })
        .catch((error) => {
          console.log('Error : ', error)
          this.setState({
            Message: 'Something Went Wrong',
            OpenSnackBar: true,
            OpenLoader: false,
            open: false,
          })
          this.handleClose()
        })
    } else {
      console.log('Project Name Is Required')
      this.setState({ OpenSnackBar: true, Message: 'Project Name Is Required' })
    }
  }

  handleUpdate = (e) => {
    console.log('Handle Update Calling ... ')
    let State = this.state
    this.CheckValidity()
    if (State.ProjectName !== '' && State.ProjectID) {
      this.setState({ OpenLoader: true })
      let data = {
        projectID: State.ProjectID,
        projectName: State.ProjectName,
        projectDescription: State.ProjectDescription,
        frontEndProjectUrl: State.FrontEndProjectUrl,
        backEndProjectUrl: State.BackEndProjectUrl,
        projectDocumentUrl: State.ProjectDocumentUrl,
        projectStatus: State.ProjectStatus,
        isActive: State.IsActive,
      }
      projectServices
        .UpdateProjectDetail(data)
        .then((data) => {
          console.log('Data : ', data)
          this.setState({
            Message: data.data.message,
            OpenSnackBar: true,
            OpenLoader: false,
            open: false,
          })
          if (this.state.OpenShow) {
            this.handleOpenList()
          } else if (this.state.OpenArchive) {
            this.handleArchiveOpen()
          } else if (this.state.OpenTrash) {
            this.handleTrashOpen()
          }
        })
        .catch((error) => {
          console.log('Error : ', error)
          this.setState({
            Message: 'Something Went Wrong',
            OpenSnackBar: true,
            OpenLoader: false,
            open: false,
          })
          if (this.state.OpenShow) {
            this.handleOpenList()
          } else if (this.state.OpenArchive) {
            this.handleArchiveOpen()
          } else if (this.state.OpenTrash) {
            this.handleTrashOpen()
          }
        })
    } else {
      console.log('Project Name Is Required')
      this.setState({ OpenSnackBar: true, Message: 'Project Name Is Required' })
    }
  }

  handleUpdateStatus = (projectID, Operation) => {
    console.log('Handle Update Status Calling ... ')
    let data = {
      operation: Operation,
      projectID: projectID,
    }
    projectServices
      .UpdateStatus(data)
      .then((data) => {
        console.log('Data : ', data)
        this.setState({
          Message: data.data.message,
          OpenSnackBar: true,
        })
        if (this.state.OpenShow) {
          this.handleOpenList()
        } else if (this.state.OpenArchive) {
          this.handleArchiveOpen()
        } else if (this.state.OpenTrash) {
          this.handleTrashOpen()
        }
      })
      .catch((error) => {
        console.log('Error : ', error)
      })
  }

  handleDeleteProjectPermanently = (ProjectID) => {
    console.log('Handle Delete Project Permanently Calling ... ')
    let data = {
      projectID: ProjectID,
    }

    projectServices
      .DeleteProjectPermanently(data)
      .then((data) => {
        console.log('Data : ', data)
        this.setState({ Message: data.data.message, Snackbar: true })
        this.handleClose()
        this.handleTrashOpen()
      })
      .catch((error) => {
        console.log('Error : ', error)
        this.handleClose()
        this.handleTrashOpen()
        this.setState({ Message: 'Something Went Wrong', Snackbar: true })
      })
  }

  handlePermanentlyDeleteModel = (note) => {
    console.log('Handle Permenantly Delete Model Calling ....')
    this.setState({
      PermenantlyDelete: true,
      ProjectID: note.projectID,
      ProjectName: note.projectName,
    })
  }

  handleMenuButton = (e) => {
    console.log('Handle Menu Button Calling ... ')
    this.setState({
      MenuOpen: !this.state.MenuOpen,
    })
  }

  handleOpen = () => {
    console.log('Handle Open Calling ... ')
    this.setState({
      open: true,
      OpenShow: true,
      OpenArchive: false,
      OpenTrash: false,
      TotalPages: !this.state.OpenInsert ? 0 : this.state.TotalPages,
    })
  }

  handleClose = () => {
    console.log('Handle Close Calling ...')
    this.setState({
      open: false,
      Update: false,
      ShowProjectInfo: false,
      PermenantlyDelete: false,
      ProjectID: '',
      ProjectName: '',
      ProjectDescription: '',
      FrontEndProjectUrl: '',
      BackEndProjectUrl: '',
      ProjectDocumentUrl: '',
      ProjectStatus: 'Private',
      IsActive: false,
    })
  }

  handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    this.setState({ OpenSnackBar: false })
  }

  handleOpenList = (e) => {
    console.log('Handle Open List Calling ... ')
    this.GetProjectList(this.state.PageNumber, 'Active')
    this.setState({
      OpenShow: true,
      OpenArchive: false,
      OpenTrash: false,
      OpenFeedBack: false,
    })
  }

  handleArchiveOpen = () => {
    console.log('Handle Archive Open Calling ....')
    this.GetProjectList(this.state.ArchivePageNumber, 'Archive')
    this.setState({
      OpenShow: false,
      OpenArchive: true,
      OpenTrash: false,
      OpenFeedBack: false,
    })
  }

  handleTrashOpen = () => {
    console.log('Handle Trash Open Calling...')
    this.GetProjectList(this.state.TrashPageNumber, 'Trash')
    this.setState({
      OpenShow: false,
      OpenArchive: false,
      OpenTrash: true,
      OpenFeedBack: false,
    })
  }

  handleFeedBackOpen = (e) => {
    console.log('Handle FeedBack Open Calling...')
    this.setState({
      OpenShow: false,
      OpenArchive: false,
      OpenTrash: false,
      OpenFeedBack: true,
    })
  }

  CheckValidity() {
    console.log('Check Validity Calling...')
    this.setState({ ProjectNameFlag: false })
    if (this.state.ProjectName === '') {
      this.setState({ ProjectNameFlag: true })
    }
  }

  handleRadioChange = (event) => {
    console.log('Handle Redio Change Calling...')
    this.setState({ ProjectStatus: event.target.value })
  }

  handleChanges = (e) => {
    const { name, value } = e.target
    this.setState(
      { [name]: value },
      console.log('name : ', name, 'Value : ', value),
    )
  }

  handleInfoModel = (note) => {
    console.log('Handle Info Model Calling...')
    this.setState(
      {
        Update: true,
        ShowProjectInfo: false,
        open: true,
        ProjectID: note.projectID,
        ProjectName: note.projectName,
        ProjectDescription: note.projectDescription,
        FrontEndProjectUrl: note.frontEndProjectUrl,
        BackEndProjectUrl: note.backEndProjectUrl,
        ProjectDocumentUrl: note.projectDocumentUrl,
        ProjectStatus: note.projectStatus,
        IsActive: note.isActive,
      },
      console.log('handleInfoModel Calling ...'),
    )
  }

  handleShowProjectInfo = (note) => {
    console.log('handleShowProjectInfo Calling ...')
    this.setState({
      ShowProjectInfo: true,
      Update: false,
      open: true,
      ProjectID: note.projectID,
      ProjectName: note.projectName,
      ProjectDescription: note.projectDescription,
      FrontEndProjectUrl: note.frontEndProjectUrl,
      BackEndProjectUrl: note.backEndProjectUrl,
      ProjectDocumentUrl: note.projectDocumentUrl,
      ProjectStatus: note.projectStatus,
      CreatedDate: note.createdDate,
      IsActive: note.isActive,
    })
  }

  handleActiveChange = (e) => {
    console.log(' Checked Status : ', e.target.checked)
    this.setState({ IsActive: e.target.checked })
  }

  handlePaging = (e, value) => {
    console.log('Current Page : ', e.target.value)

    if (this.state.OpenShow) {
      this.setState({ PageNumber: value })
      this.GetProjectList(value, 'Active')
    } else if (this.state.OpenArchive) {
      this.setState({ ArchivePageNumber: value })
      this.GetProjectList(value, 'Archive')
    } else if (this.state.OpenTrash) {
      this.setState({ TrashPageNumber: value })
      this.GetProjectList(value, 'Trash')
    }
  }

  render() {
    let state = this.state
    console.log('state : ', state)
    return (
      <div className="AdminDashboard-Container">
        <div className="Sub-Container">
          <div className="Header">
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  edge="start"
                  className=""
                  color="inherit"
                  onClick={this.handleMenuButton}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                  Admin DashBoard
                </Typography>

                <Button
                  variant="outlined"
                  style={{ color: 'white', marginRight: '50px' }}
                  onClick={this.handleOpen}
                >
                  Create Project &nbsp;
                  <InsertDriveFileIcon />
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    this.props.history.push('/SignIn')
                  }}
                >
                  LogOut
                </Button>
              </Toolbar>
            </AppBar>
          </div>
          <div className="Body">
            <div className="Sub-Body">
              <div className={state.MenuOpen ? 'SubBody11' : 'SubBody12'}>
                <div
                  className={state.OpenShow ? 'NavButton1' : 'NavButton2'}
                  onClick={this.handleOpenList}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <VisibilityIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Active Project</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenArchive ? 'NavButton1' : 'NavButton2'}
                  onClick={this.handleArchiveOpen}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <ArchiveIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Archive Project</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenTrash ? 'NavButton1' : 'NavButton2'}
                  onClick={this.handleTrashOpen}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <DeleteIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Trash Project</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenFeedBack ? 'NavButton1' : 'NavButton2'}
                  onClick={this.handleFeedBackOpen}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <FeedbackIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">FeedBack</div>
                  ) : null}
                </div>
              </div>
              <div className={state.MenuOpen ? 'SubBody21' : 'SubBody22'}>
                <Modal
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  open={this.state.open}
                  onClose={this.handleClose}
                  closeAfterTransition
                  BackdropComponent={Backdrop}
                  BackdropProps={{
                    timeout: 500,
                  }}
                >
                  <Fade in={this.state.open}>
                    <div
                      style={{
                        backgroundColor: 'white',
                        boxShadow: '5',
                        padding: '2px 4px 3px',
                        width: '500px',
                        height: '500px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      {state.ShowProjectInfo ? (
                        <>
                          <div className="Input-Field">
                            <div className="Text">Project ID</div>
                            <div
                              style={{
                                color: 'blue',
                                fontFamily: 'Roboto',
                                fontWeight: '500',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {state.ProjectID}
                            </div>
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Project Name</div>
                            <div
                              style={{
                                color: 'blue',
                                fontFamily: 'Roboto',
                                fontWeight: '500',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {state.ProjectName}
                            </div>
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Project Description</div>
                            <div
                              style={{
                                color: 'blue',
                                fontFamily: 'Roboto',
                                fontWeight: '500',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {state.ProjectDescription}
                            </div>
                          </div>
                          <div className="Input-Field">
                            <div className="Text">FrontEnd Project</div>
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              onClick={this.handleDownloadFrontEnd}
                            >
                              Download
                            </Button>
                            {/* {state.FrontEndProjectUrl} */}
                          </div>
                          <div className="Input-Field">
                            <div className="Text">BackEnd Project</div>
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              onClick={this.handleDownloadBackEnd}
                            >
                              Download
                            </Button>
                            {/* {state.BackEndProjectUrl} */}
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Project Document</div>
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              onClick={this.handleDownloadDocument}
                            >
                              Download
                            </Button>
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Created Date</div>
                            <div
                              style={{
                                color: 'blue',
                                fontFamily: 'Roboto',
                                fontWeight: '500',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {state.CreatedDate}
                            </div>
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Project Status</div>
                            <div
                              style={{
                                color:
                                  state.ProjectStatus === 'Public'
                                    ? 'blue'
                                    : '#f50057',
                                fontFamily: 'Roboto',
                                fontWeight: '500',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              {state.ProjectStatus}
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {state.Update ? (
                            <div
                              className="Input-Field"
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <div
                                className="Text"
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                Project ID : {state.ProjectID}
                              </div>
                            </div>
                          ) : null}
                          <div className="Input-Field">
                            <div className="Text">Project Name</div>
                            <TextField
                              autoComplete="off"
                              error={state.ProjectNameFlag}
                              className="Text-Input"
                              label="Name"
                              variant="outlined"
                              size="small"
                              name="ProjectName"
                              value={state.ProjectName}
                              onChange={this.handleChanges}
                            />
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Project Description</div>
                            <TextField
                              autoComplete="off"
                              className="Text-Input"
                              label="Description"
                              variant="outlined"
                              size="small"
                              name="ProjectDescription"
                              value={state.ProjectDescription}
                              onChange={this.handleChanges}
                            />
                          </div>
                          <div className="Input-Field">
                            <div className="Text">FrontEnd Project Url</div>
                            <TextField
                              autoComplete="off"
                              className="Text-Input"
                              label="Git Url"
                              variant="outlined"
                              size="small"
                              name="FrontEndProjectUrl"
                              value={state.FrontEndProjectUrl}
                              onChange={this.handleChanges}
                            />
                          </div>
                          <div className="Input-Field">
                            <div className="Text">BackEnd Project Url</div>
                            <TextField
                              autoComplete="off"
                              className="Text-Input"
                              label="Git Url"
                              variant="outlined"
                              size="small"
                              name="BackEndProjectUrl"
                              value={state.BackEndProjectUrl}
                              onChange={this.handleChanges}
                            />
                          </div>
                          <div className="Input-Field">
                            <div className="Text">Project Document Url</div>
                            <TextField
                              autoComplete="off"
                              className="Text-Input"
                              label="Document Url"
                              variant="outlined"
                              size="small"
                              name="ProjectDocumentUrl"
                              value={state.ProjectDocumentUrl}
                              onChange={this.handleChanges}
                            />
                          </div>
                          <div className="Input-Field">
                            <RadioGroup
                              style={{
                                width: 'inherit',
                                display: 'block',
                                margin: '0 0 0 130px',
                              }}
                              name="gender1"
                              value={this.state.ProjectStatus}
                              onChange={this.handleRadioChange}
                            >
                              <FormControlLabel
                                value="Private"
                                control={<Radio />}
                                label="Private"
                              />
                              <FormControlLabel
                                value="Public"
                                control={<Radio />}
                                label="Public"
                              />
                            </RadioGroup>
                          </div>
                          <div className="Input-Field">
                            <div
                              className="Text"
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              Project Is Active
                            </div>
                            <Switch
                              checked={state.IsActive}
                              onChange={this.handleActiveChange}
                              color="primary"
                              inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                          </div>
                          <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            style={{ margin: '10px 0 0 0' }}
                            onClick={
                              state.Update
                                ? this.handleUpdate
                                : this.handleSubmit
                            }
                          >
                            {state.Update ? <>Update</> : <>Upload</>}
                          </Button>
                        </>
                      )}
                    </div>
                  </Fade>
                </Modal>
                {state.PermenantlyDelete ? (
                  <Modal
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    open={this.state.PermenantlyDelete}
                    onClose={this.handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                      timeout: 500,
                    }}
                  >
                    <Fade in={this.state.PermenantlyDelete}>
                      <div
                        style={{
                          backgroundColor: 'white',
                          boxShadow: '5',
                          padding: '2px 4px 3px',
                          width: '500px',
                          height: '300px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                        }}
                      >
                        <div
                          className="Input-Field"
                          style={{
                            width: 450,
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          Are you sure you want to Delete {state.ProjectName}{' '}
                          Project ?
                        </div>
                        <Button
                          variant="contained"
                          color="Secondary"
                          component="span"
                          style={{ margin: '10px 0 0 0' }}
                          onClick={() => {
                            this.handleDeleteProjectPermanently(state.ProjectID)
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="contained"
                          // color="primary"
                          component="span"
                          style={{
                            margin: '10px 0 0 0',
                            background: 'black',
                            color: 'white',
                          }}
                          onClick={() => {
                            this.handleClose()
                          }}
                        >
                          Cancle
                        </Button>
                      </div>
                    </Fade>
                  </Modal>
                ) : null}

                <GetProjectList
                  List={this.state.FileDataList}
                  //
                  OpenArchive={state.OpenArchive}
                  OpenTrash={state.OpenTrash}
                  //
                  CurrentPage={this.state.PageNumber}
                  ArchivePageNumber={this.state.ArchivePageNumber}
                  TrashPageNumber={this.state.TrashPageNumber}
                  //
                  GetFileData={this.GetFileData}
                  handleShowProjectInfo={this.handleShowProjectInfo}
                  handleInfoModel={this.handleInfoModel}
                  handleUpdateStatus={this.handleUpdateStatus}
                  handlePermanentlyDeleteModel={
                    this.handlePermanentlyDeleteModel
                  }
                  LoaderToggling={this.LoaderToggling}
                />
              </div>
            </div>
            <Pagination
              count={this.state.TotalPages}
              Page={this.state.PageNumber}
              onChange={this.handlePaging}
              variant="outlined"
              shape="rounded"
              color="secondary"
            />
          </div>
        </div>
        <Backdrop
          style={{ zIndex: '1', color: '#fff' }}
          open={this.state.OpenLoader}
          onClick={() => {
            this.setState({ OpenLoader: false })
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={state.OpenSnackBar}
          autoHideDuration={2000}
          onClose={this.handleSnackBarClose}
          message={state.Message}
          action={
            <React.Fragment>
              <Button
                color="secondary"
                size="small"
                onClick={this.handleSnackBarClose}
              >
                UNDO
              </Button>
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={this.handleSnackBarClose}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    )
  }
}
