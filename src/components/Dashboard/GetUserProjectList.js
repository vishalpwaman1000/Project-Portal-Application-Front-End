import React from 'react'
import './GetProjectList.scss'

import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

export default function GetUserProjectList(props) {
  const Notes =
    props.List != null &&
    props.List.map((note, index) => (
      <Card style={{ maxWidth: 300 }} className="Card-Layout" key={index}>
        <CardActionArea
          onClick={() => {
            props.handleShowProjectInfo(note)
          }}
        >
          <CardContent
            style={{
              height: 154,
              fontStyle: 'Roboto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
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
      </Card>
    ))

  return (
    <div className="GetProjectList-Container">
      <div className="Sub-Container">{Notes}</div>
    </div>
  )
}
