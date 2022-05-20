import AxiosServices from './AxiosServices'
import CustomerConfigurations from './../configurations/CustomerConfiguration'

const axiosServices = new AxiosServices()

export default class ProjectCustomerServices {
  GetCustomerProjectList(data) {
    return axiosServices.post(
      CustomerConfigurations.GetCustomerProjectList,
      data,
      false,
    )
  }

  UpdateCustomerAsPrime(data) {
    return axiosServices.patch(
      CustomerConfigurations.UpdateCustomerAsPrime,
      data,
      false,
    )
  }

  AddFeedback(data) {
    return axiosServices.post(CustomerConfigurations.AddFeedback, data, false)
  }

  GetFeedbackDetails(data) {
    return axiosServices.post(
      CustomerConfigurations.GetFeedbackDetails,
      data,
      false,
    )
  }
}
