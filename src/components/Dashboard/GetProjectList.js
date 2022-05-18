import React from 'react'
import './GetProjectList.scss'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import UpdateIcon from '@material-ui/icons/Update'
import RestoreIcon from '@material-ui/icons/Restore'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import ArchiveIcon from '@material-ui/icons/Archive'
import TimelineDot from '@material-ui/lab/TimelineDot'
import IconButton from '@material-ui/core/IconButton'

export default function GetProjectList(props) {
  const [checkedA, setcheckedA] = React.useState(true)
  const handleChange = (event) => {
    console.log('Checked : ', event.target.checked)
    setcheckedA(event.target.checked)
  }

  const Notes =
    props.List != null &&
    props.List.map((note, index) => (
      <Card style={{ maxWidth: 300 }} className="Card-Layout" key={index}>
        <CardActionArea
          onClick={() => {
            props.handleShowProjectInfo(note)
          }}
        >
          <CardContent style={{ height: 100, fontStyle: 'Roboto' }}>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ fontSize: '1.2rem' }}
            >
              {note.projectName}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {note.projectDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          {!note.isTrash && !note.isArchive ? (
            <>
              <IconButton
                size="medium"
                style={{ color: 'black' }}
                onClick={() => {
                  props.handleInfoModel(note)
                }}
              >
                <UpdateIcon />
              </IconButton>
              <IconButton
                size="medium"
                style={{ color: 'black' }}
                onClick={() => {
                  props.handleUpdateStatus(note.projectID, 'Archive')
                }}
              >
                <ArchiveIcon />
              </IconButton>
            </>
          ) : note.isTrash || note.isArchive ? (
            <>
              <IconButton
                size="medium"
                style={{ color: 'black' }}
                onClick={() => {
                  props.handleUpdateStatus(note.projectID, 'Active')
                }}
              >
                <RestoreIcon />
              </IconButton>
            </>
          ) : null}

          <IconButton
            size="medium"
            style={{ color: 'black' }}
            onClick={() => {
              note.isTrash
                ? props.handlePermanentlyDeleteModel(note)
                : props.handleUpdateStatus(note.projectID, 'Trash')
            }}
          >
            <DeleteIcon />
          </IconButton>
          <div style={{ display: 'flex' }}>
            <div
              style={{
                fontSize: 14,
                color: note.isActive ? 'blue' : '#f50057',
                fontFamily: 'Roboto',
              }}
            >
              {note.isActive ? <>Active</> : <>InActive</>}
            </div>
            <TimelineDot
              color={note.isActive ? 'primary' : 'secondary'}
              style={{ margin: '3px 0 0 5px' }}
            />
          </div>
        </CardActions>
      </Card>
    ))

  return (
    <div className="GetProjectList-Container">
      <div className="Sub-Container">{Notes}</div>
    </div>
  )
}
