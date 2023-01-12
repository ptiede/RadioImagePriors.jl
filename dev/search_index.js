var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = VLBIImagePriors","category":"page"},{"location":"#VLBIImagePriors","page":"Home","title":"VLBIImagePriors","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for VLBIImagePriors.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [VLBIImagePriors]","category":"page"},{"location":"#VLBIImagePriors.AngleTransform","page":"Home","title":"VLBIImagePriors.AngleTransform","text":"AngleTransform\n\nA transformation that moves two vector x and y to an angle θ.  Note that is x and y are normally distributed then the resulting distribution in θ is uniform on the circle.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.CenteredImage","page":"Home","title":"VLBIImagePriors.CenteredImage","text":"CenteredImage(x, y, σ, p)\n\nRegularizes a general image prior p such that the center of light is close the the origin of the imag. After regularization the log density of the prior is modified to\n\n    log p(I) to log p(I) - frac(x_C^2 + y_C^2)^22sigma^2 N_x N_y\n\nwhere N_x and N_y are the number of pixels in the x and y direction of the image, and x_C y_C are the center of light of the image I.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.DiagonalVonMises","page":"Home","title":"VLBIImagePriors.DiagonalVonMises","text":"DiagonalVonMises(μ::Real, κ::Real)\nDiagonalVonMises(μ::AbstractVector{<:Real}, κ::AbstractVector{<:Real})\n\nConstructs a Von Mises distribution, with mean μ and concentraion parameter κ. If μ and κ are vectors then this constructs a independent multivariate Von Mises distribution.\n\nNotes\n\nThis is a custom implementation since the version in Distributions.jl has certain properties that do not play well (having an support only between [-π+μ, π+μ]) with usual VLBI problems. Additionally this distribution has a special overloaded product_distribution method so that concatenating multiple DiagVonMises together preserves the type. This is helpful for Zygote autodiff.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageDirichlet","page":"Home","title":"VLBIImagePriors.ImageDirichlet","text":"ImageDirichlet(α::AbstractMatrix)\nImageDirichlet(α::Real, ny, nx)\n\nA Dirichlet distribution defined on a matrix. Samples from this produce matrices whose elements sum to unity. This is a useful image prior when you want to separately constrain the flux. The  α parameter defines the usual Dirichlet concentration amount.\n\nNotes\n\nMuch of this code was taken from Distributions.jl and it's Dirichlet distribution. However, some changes were made to make it faster. Additionally, we use define a custom rrule to speed up derivatives.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageSimplex","page":"Home","title":"VLBIImagePriors.ImageSimplex","text":"ImageSimplex(ny,nx)\n\nThis defines a transformation from ℝⁿ⁻¹ to the n probability simplex defined on an matrix with dimension ny×nx. This is a more natural transformation for rasterized images, which are most naturally represented as a matrix.\n\nNotes\n\nMuch of this code was inspired by TransformVariables. However, we have specified custom rrules using Enzyme as a backend. This allowed the simplex transform to be used with Zygote and we achieved an order of magnitude speedup when computing the pullback of the simplex transform.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageSphericalUniform","page":"Home","title":"VLBIImagePriors.ImageSphericalUniform","text":"ImageSphericalUniform(nx, ny)\n\nConstruct a distribution where each image pixel is a 3-sphere uniform variable. This is useful for polarization where the stokes parameters are parameterized on the 3-sphere.\n\nCurrently we use a struct of vectors memory layout. That is the image is described by three matrices (X,Y,Z) grouped together as a tuple, where each matrix is one direction on the sphere, and we require norm((X,Y,Z)) == 1.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.ImageUniform","page":"Home","title":"VLBIImagePriors.ImageUniform","text":"ImageUniform(a::Real, b::Real, nx, ny)\n\nA uniform distribution in image pixels where a/b are the lower/upper bound for the interval. This then concatenates ny×nx uniform distributions together.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.SphericalUnitVector","page":"Home","title":"VLBIImagePriors.SphericalUnitVector","text":"SphericalUnitVector{N}()\n\nA transformation from a set of N+1 vectors to the N sphere. The set of N+1 vectors are inherently assumed to be N+1 a distributed according to a unit multivariate Normal distribution.\n\nNotes\n\nFor more information about this transformation see the Stan manual. In the future this may be depricated when  is merged.\n\n\n\n\n\n","category":"type"},{"location":"#VLBIImagePriors.WrappedUniform","page":"Home","title":"VLBIImagePriors.WrappedUniform","text":"WrappedUniform(period)\n\nConstructs a potentially multivariate uniform distribution that is wrapped a given period. That is\n\nd = WrappedUniform(period)\nlogpdf(d, x) ≈ logpdf(d, x+period)\n\nfor any x.\n\nIf period is a vector this creates a multivariate independent wrapped uniform distribution.\n\n\n\n\n\n","category":"type"}]
}