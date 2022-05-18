import Configurations from '../configurations/Configurations'
import AxiosServices from './AxiosServices'

const axiosServices = new AxiosServices()

export default class ProjectServices {
  UploadProjectDetail(data) {
    return axiosServices.post(Configurations.UploadProjectDetail, data, false)
  }

  GetProjectList(data) {
    return axiosServices.post(Configurations.GetProjectList, data, false)
  }

  UpdateStatus(data) {
    return axiosServices.post(Configurations.UpdateStatus, data, false)
  }

  UpdateProjectDetail(data) {
    return axiosServices.post(Configurations.UpdateProjectDetail, data, false)
  }

  DeleteProjectPermanently(data) {
    return axiosServices.post(
      Configurations.DeleteProjectPermanently,
      data,
      false,
    )
  }
}
