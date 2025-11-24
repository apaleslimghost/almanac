class ErrorsController < ApplicationController
  layout "header_and_content"

  def show
    @exception = request.env["action_dispatch.exception"]
    @status_code = @exception.try(:status_code) ||
                   ActionDispatch::ExceptionWrapper.new(
                    request.env, @exception
                  ).status_code

    @image = image_for_code(@status_code)
    render view_for_code(@status_code), status: @status_code
  end

  private
    def view_for_code(code)
      supported_error_codes.fetch(code, "404")
    end

    def supported_error_codes
      {
        404 => "404",
        500 => "500"
      }
    end

    def image_for_code(code)
      case code
      when 404
        UnsplashImage.brand_404
      when 500
        UnsplashImage.brand_500
      else
        UnsplashImage.brand_image
      end
    end
end
