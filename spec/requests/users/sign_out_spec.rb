require 'spec_helper.rb'


feature "Sign Out", %q{
  To protect my account from unauthorized access
  A signed in user
  Should be able to sign out
} do

  background do
    user =  create(:user)
    sign_in user
  end

  scenario "User signs out" do
    sign_out
    expect(page).to have_content "Signed out successfully."
    visit "/"
    expect(page).to have_content "Sign up"
    expect(page).to have_content "Login"
    expect(page).not_to have_content "Logout"
  end

end
