class Api::V1::DepotsController < Api::V1::BaseController
  def create
    @depot.user = current_user if current_user
    create!
  end
end
