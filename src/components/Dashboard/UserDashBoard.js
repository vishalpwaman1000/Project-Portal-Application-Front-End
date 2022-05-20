import React, { Component } from 'react'
import './UserDashBoard.scss'
import GetUserProjectList from './GetUserProjectList'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import PublicIcon from '@material-ui/icons/Public'
import FeedbackIcon from '@material-ui/icons/Feedback'
import Pagination from '@material-ui/lab/Pagination'
import Modal from '@material-ui/core/Modal'
import Backdrop from '@material-ui/core/Backdrop'
import Fade from '@material-ui/core/Fade'
import CircularProgress from '@material-ui/core/CircularProgress'
import Snackbar from '@material-ui/core/Snackbar'
import CloseIcon from '@material-ui/icons/Close'

import ProjectServices from '../../services/ProjectAdminServices'

const projectServices = new ProjectServices()

export default class UserDashBoard extends Component {
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
    this.GetProjectList(this.state.PageNumber, 'Active')
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

  handlePrimeProject = () => {

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

  render() {
    let state = this.state
    return (
      <div className="UserDashBoard-Container">
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
                  User DashBoard
                </Typography>
                <Button
                  variant="outlined"
                  style={{ color: 'white', marginRight: '50px' }}
                  onClick={this.handleFeedOpen}
                >
                  Feedback &nbsp;
                  <FeedbackIcon />
                </Button>
                <Button
                  variant="outlined"
                  style={{ color: 'white', marginRight: '50px' }}
                  onClick={this.handleOpen}
                >
                  Buy Prime Membership &nbsp;
                  <LocalOfferIcon />
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
                    <PublicIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Public Project</div>
                  ) : null}
                </div>

                <div
                  className={state.OpenArchive ? 'NavButton1' : 'NavButton2'}
                  onClick={this.handlePrimeProject}
                >
                  <IconButton edge="start" className="NavBtn" color="inherit">
                    <EmojiPeopleIcon />
                  </IconButton>
                  {this.state.MenuOpen ? (
                    <div className="NavButtonText">Primary Project</div>
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
                        height: '200px',
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
                          <div className="Input-Field">
                            <div className="Text">
                              Are You Sure To Buy Prime Membership ?
                            </div>
                          </div>
                          <div style={{ display: 'flex' }}>
                            <Button
                              variant="contained"
                              color="primary"
                              component="span"
                              style={{ margin: '10px 10px 0 0' }}
                              onClick={this.handleSubmit}
                            >
                              Buy
                            </Button>
                            <Button
                              variant="outlined"
                              style={{ margin: '10px 0 0 10px' }}
                              onClick={this.handleSubmit}
                            >
                              Cancle
                            </Button>
                          </div>
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

                <GetUserProjectList
                  List={this.state.FileDataList}
                  CurrentPage={this.state.PageNumber}
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
